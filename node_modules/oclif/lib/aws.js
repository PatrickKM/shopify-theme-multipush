"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_cloudfront_1 = require("@aws-sdk/client-cloudfront");
const client_s3_1 = require("@aws-sdk/client-s3");
const errors_1 = require("@oclif/core/errors");
const ux_1 = require("@oclif/core/ux");
const fs_extra_1 = require("fs-extra");
const log_1 = require("./log");
const util_1 = require("./util");
const debug = log_1.debug.new('aws');
const cache = {};
const aws = {
    get cloudfront() {
        cache.cloudfront =
            cache.cloudfront || new (require('@aws-sdk/client-cloudfront').CloudFrontClient)({ credentials: this.creds });
        return cache.cloudfront;
    },
    get creds() {
        const creds = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN,
        };
        if (!creds.accessKeyId)
            throw new Error('AWS_ACCESS_KEY_ID not set');
        if (!creds.secretAccessKey)
            throw new Error('AWS_SECRET_ACCESS_KEY not set');
        return creds;
    },
    get s3() {
        try {
            const endpoint = process.env.AWS_S3_ENDPOINT;
            const checksumConfig = (0, util_1.getS3ChecksumConfig)(endpoint, process.env.AWS_REQUEST_CHECKSUM_CALCULATION);
            cache.s3 =
                cache.s3 ??
                    new (require('@aws-sdk/client-s3').S3Client)({
                        credentials: this.creds,
                        endpoint,
                        forcePathStyle: Boolean(process.env.AWS_S3_FORCE_PATH_STYLE),
                        region: process.env.AWS_REGION ?? 'us-east-1',
                        // Support disabling checksums for S3-compatible storage
                        ...(checksumConfig && {
                            requestChecksumCalculation: checksumConfig,
                        }),
                    });
            return cache.s3;
        }
        catch (error) {
            const { code, message } = error;
            if (code === 'MODULE_NOT_FOUND')
                throw new Error(`${message}\n@aws-sdk/client-s3 is needed to run this command.\nInstall @aws-sdk/client-s3 as a devDependency in your CLI. \`yarn add -D @aws-sdk/client-s3\``);
            throw error;
        }
    },
};
exports.default = {
    get cloudfront() {
        return {
            createCloudfrontInvalidation: (options) => new Promise((resolve, reject) => {
                (0, log_1.log)('createCloudfrontInvalidation', options.DistributionId, options.InvalidationBatch?.Paths?.Items);
                aws.cloudfront
                    ?.send(new client_cloudfront_1.CreateInvalidationCommand(options))
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }),
        };
    },
    get s3() {
        return {
            copyObject: (options, { dryRun, ignoreMissing, namespace }) => new Promise((resolve, reject) => {
                const logNamespace = namespace ? `> ${namespace}` : `> s3://${options.CopySource}`;
                ux_1.ux.stdout(logNamespace);
                ux_1.ux.stdout('  action: copy');
                ux_1.ux.stdout(`  source: s3://${options.CopySource}`);
                ux_1.ux.stdout(`  target: s3://${options.Bucket}/${options.Key}`);
                ux_1.ux.stdout();
                if (dryRun)
                    return;
                aws.s3
                    ?.send(new client_s3_1.CopyObjectCommand(options))
                    .then((data) => resolve(data))
                    .catch((error) => {
                    if (error.Code === 'NoSuchKey') {
                        if (ignoreMissing) {
                            ux_1.ux.stdout(logNamespace);
                            ux_1.ux.stdout(`  warning: s3://${options.CopySource} does not exist - skipping because of --ignore-missing`);
                            return;
                        }
                        ux_1.ux.stdout(logNamespace);
                        ux_1.ux.stdout(`  error: s3://${options.CopySource} does not exist`);
                        reject(new errors_1.CLIError(`Failed to copy source object s3://${options.CopySource} to s3://${options.Bucket}/${options.Key} because the source object does not exist`, {
                            suggestions: [
                                'Use the "oclif upload" to upload the object first',
                                'Use the "--targets" flag to specify existing targets',
                                'Use the "--ignore-missing" flag to skip this error',
                            ],
                        }));
                    }
                    reject(error);
                });
            }),
            deleteObjects: (options) => new Promise((resolve, reject) => {
                debug('deleteObjects', `s3://${options.Bucket}`);
                aws.s3
                    ?.send(new client_s3_1.DeleteObjectsCommand(options))
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }),
            getObject: (options) => new Promise((resolve, reject) => {
                debug('getObject', `s3://${options.Bucket}/${options.Key}`);
                aws.s3
                    ?.send(new client_s3_1.GetObjectCommand(options))
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }),
            headObject: (options) => new Promise((resolve, reject) => {
                debug('s3:headObject', `s3://${options.Bucket}/${options.Key}`);
                aws.s3
                    ?.send(new client_s3_1.HeadObjectCommand(options))
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }),
            listObjects: (options) => new Promise((resolve, reject) => {
                debug('listObjects', `s3://${options.Bucket}/${options.Prefix}`);
                aws.s3
                    ?.send(new client_s3_1.ListObjectsV2Command(options))
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }),
            uploadFile: (local, options, { dryRun } = {}) => new Promise((resolve, reject) => {
                ux_1.ux.stdout(`> ${local}`);
                ux_1.ux.stdout('  action: upload');
                ux_1.ux.stdout(`  source: ${(0, util_1.prettifyPaths)(local)}`);
                ux_1.ux.stdout(`  target: s3://${options.Bucket}/${options.Key}`);
                ux_1.ux.stdout();
                if (dryRun)
                    return;
                options.Body = (0, fs_extra_1.createReadStream)(local);
                aws.s3
                    ?.send(new client_s3_1.PutObjectCommand(options))
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }),
        };
    },
};

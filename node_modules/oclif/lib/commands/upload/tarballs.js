"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const fs = __importStar(require("node:fs"));
const aws_1 = __importDefault(require("../../aws"));
const log_1 = require("../../log");
const Tarballs = __importStar(require("../../tarballs"));
const upload_util_1 = require("../../upload-util");
class UploadTarballs extends core_1.Command {
    static description = 'Upload an oclif CLI to S3.';
    static flags = {
        'dry-run': core_1.Flags.boolean({ description: 'Run the command without uploading to S3.' }),
        root: core_1.Flags.string({ char: 'r', default: '.', description: 'Path to oclif CLI root.', required: true }),
        sha: core_1.Flags.string({
            description: '7-digit short git commit SHA (defaults to current checked out commit).',
            required: false,
        }),
        targets: core_1.Flags.string({ char: 't', description: 'Comma-separated targets to upload (e.g.: linux-arm,win32-x64).' }),
        xz: core_1.Flags.boolean({ allowNo: true, description: 'Also upload xz.' }),
    };
    async run() {
        const { flags } = await this.parse(UploadTarballs);
        const buildConfig = await Tarballs.buildConfig(flags.root, {
            sha: flags?.sha,
            targets: flags?.targets?.split(','),
            xz: flags.xz,
        });
        const { config, dist, s3Config, xz } = buildConfig;
        // fail early if targets are not built
        for (const target of buildConfig.targets) {
            const tarball = dist((0, upload_util_1.templateShortKey)('versioned', {
                bin: config.bin,
                ext: '.tar.gz',
                sha: buildConfig.gitSha,
                version: config.version,
                ...target,
            }));
            if (!fs.existsSync(tarball))
                this.error(`Cannot find a tarball ${tarball} for ${target.platform}-${target.arch}`, {
                    suggestions: [`Run "oclif pack --target ${target.platform}-${target.arch}" before uploading`],
                });
        }
        const S3Options = {
            ACL: s3Config.acl || 'public-read',
            Bucket: s3Config.bucket,
        };
        const uploadTarball = async (options) => {
            const shortKeyInputs = {
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                arch: options?.arch,
                bin: config.bin,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                platform: options?.platform,
                sha: buildConfig.gitSha,
                version: config.version,
            };
            const releaseTarballs = async (ext) => {
                const localKey = (0, upload_util_1.templateShortKey)('versioned', { ...shortKeyInputs, ext });
                const cloudKey = `${(0, upload_util_1.commitAWSDir)(config.version, buildConfig.gitSha, s3Config)}/${localKey}`;
                await aws_1.default.s3.uploadFile(dist(localKey), {
                    ...S3Options,
                    CacheControl: 'max-age=604800',
                    ContentType: 'application/gzip',
                    Key: cloudKey,
                }, {
                    dryRun: flags['dry-run'],
                });
            };
            const maybeUploadManifest = async () => {
                const manifest = (0, upload_util_1.templateShortKey)('manifest', shortKeyInputs);
                const cloudKey = `${(0, upload_util_1.commitAWSDir)(config.version, buildConfig.gitSha, s3Config)}/${manifest}`;
                const local = dist(manifest);
                (0, log_1.log)(`checking for buildmanifest at ${local}`);
                if (fs.existsSync(local)) {
                    (0, log_1.log)(`uploading buildmanifest ${manifest}`);
                    return aws_1.default.s3.uploadFile(dist(manifest), {
                        ...S3Options,
                        CacheControl: 'max-age=86400',
                        ContentType: 'application/json',
                        Key: cloudKey,
                    }, {
                        dryRun: flags['dry-run'],
                    });
                }
                core_1.ux.warn(`Cannot find buildmanifest ${local}. CLI will not be able to update itself.`);
            };
            await Promise.all([
                releaseTarballs('.tar.gz'),
                maybeUploadManifest(),
                ...(xz ? [releaseTarballs('.tar.xz')] : []),
            ]);
        };
        if (buildConfig.targets.length > 0)
            (0, log_1.log)('uploading targets');
        await Promise.all(buildConfig.targets.map((t) => uploadTarball(t)));
        (0, log_1.log)(`done uploading tarballs & manifests for v${config.version}-${buildConfig.gitSha}`);
    }
}
exports.default = UploadTarballs;

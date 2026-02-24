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
const client_s3_1 = require("@aws-sdk/client-s3");
const core_1 = require("@oclif/core");
const node_path_1 = __importDefault(require("node:path"));
const aws_1 = __importDefault(require("../aws"));
const Tarballs = __importStar(require("../tarballs"));
const upload_util_1 = require("../upload-util");
const util_1 = require("../util");
const version_indexes_1 = require("../version-indexes");
class Promote extends core_1.Command {
    static description = 'Promote CLI builds to a S3 release channel.';
    static flags = {
        channel: core_1.Flags.string({ default: 'stable', description: 'Channel to promote to.', required: true }),
        deb: core_1.Flags.boolean({ char: 'd', description: 'Promote debian artifacts.' }),
        'dry-run': core_1.Flags.boolean({
            description: 'Run the command without uploading to S3 or copying versioned tarballs/installers to channel.',
        }),
        'ignore-missing': core_1.Flags.boolean({
            description: 'Ignore missing tarballs/installers and continue promoting the rest.',
        }),
        indexes: core_1.Flags.boolean({ description: 'Append the promoted urls into the index files.' }),
        macos: core_1.Flags.boolean({ char: 'm', description: 'Promote macOS pkg.' }),
        'max-age': core_1.Flags.string({ char: 'a', default: '86400', description: 'Cache control max-age in seconds.' }),
        root: core_1.Flags.string({ char: 'r', default: '.', description: 'Path to the oclif CLI project root.', required: true }),
        sha: core_1.Flags.string({ description: '7-digit short git commit SHA of the CLI to promote.', required: true }),
        targets: core_1.Flags.string({ char: 't', description: 'Comma-separated targets to promote (e.g.: linux-arm,win32-x64).' }),
        version: core_1.Flags.string({ description: 'Semantic version of the CLI to promote.', required: true }),
        win: core_1.Flags.boolean({ char: 'w', description: 'Promote Windows exe.' }),
        xz: core_1.Flags.boolean({ allowNo: true, description: 'Also upload xz.' }),
    };
    async run() {
        const { flags } = await this.parse(Promote);
        if (flags['ignore-missing']) {
            this.warn("--ignore-missing flag is being used - This command will continue to run even if a promotion fails because it doesn't exist");
        }
        this.log(`Promoting v${flags.version} (${flags.sha}) to ${flags.channel} channel\n`);
        const buildConfig = await Tarballs.buildConfig(flags.root, { targets: flags?.targets?.split(',') });
        const { config, s3Config } = buildConfig;
        const indexDefaults = {
            maxAge: `max-age=${flags['max-age']}`,
            s3Config,
            version: flags.version,
        };
        if (!s3Config.bucket)
            this.error('Cannot determine S3 bucket for promotion');
        const awsDefaults = {
            ACL: s3Config.acl ?? client_s3_1.ObjectCannedACL.public_read,
            Bucket: s3Config.bucket,
            CacheControl: indexDefaults.maxAge,
            MetadataDirective: client_s3_1.MetadataDirective.REPLACE,
        };
        const cloudBucketCommitKey = (shortKey) => node_path_1.default.posix.join(s3Config.bucket, (0, upload_util_1.commitAWSDir)(flags.version, flags.sha, s3Config), shortKey);
        const cloudChannelKey = (shortKey) => node_path_1.default.posix.join((0, upload_util_1.channelAWSDir)(flags.channel, s3Config), shortKey);
        // copy tarballs manifests
        const promoteManifest = async (target) => {
            const manifest = (0, upload_util_1.templateShortKey)('manifest', {
                arch: target.arch,
                bin: config.bin,
                platform: target.platform,
                sha: flags.sha,
                version: flags.version,
            });
            // strip version & sha so update/scripts can point to a static channel manifest
            const unversionedManifest = manifest.replace(`-v${flags.version}-${flags.sha}`, '');
            await aws_1.default.s3.copyObject({
                ...awsDefaults,
                CopySource: cloudBucketCommitKey(manifest),
                Key: cloudChannelKey(unversionedManifest),
            }, {
                dryRun: flags['dry-run'],
                ignoreMissing: flags['ignore-missing'],
                namespace: unversionedManifest,
            });
        };
        const promoteGzTarballs = async (target) => {
            const versionedTarGzName = (0, upload_util_1.templateShortKey)('versioned', {
                arch: target.arch,
                bin: config.bin,
                ext: '.tar.gz',
                platform: target.platform,
                sha: flags.sha,
                version: flags.version,
            });
            const versionedTarGzKey = cloudBucketCommitKey(versionedTarGzName);
            // strip version & sha so update/scripts can point to a static channel tarball
            const unversionedTarGzName = versionedTarGzName.replace(`-v${flags.version}-${flags.sha}`, '');
            const unversionedTarGzKey = cloudChannelKey(unversionedTarGzName);
            await Promise.all([
                aws_1.default.s3.copyObject({
                    ...awsDefaults,
                    CopySource: versionedTarGzKey,
                    Key: unversionedTarGzKey,
                }, {
                    dryRun: flags['dry-run'],
                    ignoreMissing: flags['ignore-missing'],
                    namespace: unversionedTarGzName,
                }),
                ...(flags.indexes
                    ? [
                        (0, version_indexes_1.appendToIndex)({
                            ...indexDefaults,
                            dryRun: flags['dry-run'],
                            filename: unversionedTarGzName,
                            originalUrl: versionedTarGzKey,
                        }),
                    ]
                    : []),
            ]);
        };
        const promoteXzTarballs = async (target) => {
            const versionedTarXzName = (0, upload_util_1.templateShortKey)('versioned', {
                arch: target.arch,
                bin: config.bin,
                ext: '.tar.xz',
                platform: target.platform,
                sha: flags.sha,
                version: flags.version,
            });
            const versionedTarXzKey = cloudBucketCommitKey(versionedTarXzName);
            // strip version & sha so update/scripts can point to a static channel tarball
            const unversionedTarXzName = versionedTarXzName.replace(`-v${flags.version}-${flags.sha}`, '');
            const unversionedTarXzKey = cloudChannelKey(unversionedTarXzName);
            await Promise.all([
                aws_1.default.s3.copyObject({
                    ...awsDefaults,
                    CopySource: versionedTarXzKey,
                    Key: unversionedTarXzKey,
                }, {
                    dryRun: flags['dry-run'],
                    ignoreMissing: flags['ignore-missing'],
                    namespace: unversionedTarXzName,
                }),
                ...(flags.indexes
                    ? [
                        (0, version_indexes_1.appendToIndex)({
                            ...indexDefaults,
                            dryRun: flags['dry-run'],
                            filename: unversionedTarXzName,
                            originalUrl: versionedTarXzKey,
                        }),
                    ]
                    : []),
            ]);
        };
        const promoteMacInstallers = async () => {
            const arches = (0, util_1.uniq)(buildConfig.targets.filter((t) => t.platform === 'darwin').map((t) => t.arch));
            await Promise.all(arches.map(async (arch) => {
                const darwinPkg = (0, upload_util_1.templateShortKey)('macos', { arch, bin: config.bin, sha: flags.sha, version: flags.version });
                const darwinCopySource = cloudBucketCommitKey(darwinPkg);
                // strip version & sha so scripts can point to a static channel pkg
                const unversionedPkg = darwinPkg.replace(`-v${flags.version}-${flags.sha}`, '');
                await Promise.all([
                    aws_1.default.s3.copyObject({
                        ...awsDefaults,
                        CopySource: darwinCopySource,
                        Key: cloudChannelKey(unversionedPkg),
                    }, {
                        dryRun: flags['dry-run'],
                        ignoreMissing: flags['ignore-missing'],
                        namespace: unversionedPkg,
                    }),
                    ...(flags.indexes
                        ? [
                            (0, version_indexes_1.appendToIndex)({
                                ...indexDefaults,
                                dryRun: flags['dry-run'],
                                filename: unversionedPkg,
                                originalUrl: darwinCopySource,
                            }),
                        ]
                        : []),
                ]);
            }));
        };
        const promoteWindowsInstallers = async () => {
            // copy win exe
            const arches = buildConfig.targets.filter((t) => t.platform === 'win32').map((t) => t.arch);
            await Promise.all(arches.map(async (arch) => {
                const winPkg = (0, upload_util_1.templateShortKey)('win32', { arch, bin: config.bin, sha: flags.sha, version: flags.version });
                const winCopySource = cloudBucketCommitKey(winPkg);
                // strip version & sha so scripts can point to a static channel exe
                const unversionedExe = winPkg.replace(`-v${flags.version}-${flags.sha}`, '');
                await Promise.all([
                    aws_1.default.s3.copyObject({
                        ...awsDefaults,
                        CopySource: winCopySource,
                        Key: cloudChannelKey(unversionedExe),
                    }, {
                        dryRun: flags['dry-run'],
                        ignoreMissing: flags['ignore-missing'],
                        namespace: unversionedExe,
                    }),
                    ...(flags.indexes
                        ? [
                            (0, version_indexes_1.appendToIndex)({
                                ...indexDefaults,
                                dryRun: flags['dry-run'],
                                filename: unversionedExe,
                                originalUrl: winCopySource,
                            }),
                        ]
                        : []),
                ]);
                core_1.ux.action.stop('successfully');
            }));
        };
        const promoteDebianAptPackages = async () => {
            const arches = buildConfig.targets.filter((t) => t.platform === 'linux');
            // copy debian artifacts
            const debArtifacts = [
                ...arches
                    .filter((a) => !a.arch.includes('x86')) // See todo below
                    .map((a) => (0, upload_util_1.templateShortKey)('deb', {
                    arch: (0, upload_util_1.debArch)(a.arch),
                    bin: config.bin,
                    versionShaRevision: (0, upload_util_1.debVersion)(buildConfig),
                })),
                'Packages.gz',
                'Packages.xz',
                'Packages.bz2',
                'Release',
                'InRelease',
                'Release.gpg',
            ];
            await Promise.all(debArtifacts.flatMap((artifact) => {
                const debCopySource = cloudBucketCommitKey(`apt/${artifact}`);
                const debKey = cloudChannelKey(`apt/${artifact}`);
                // apt expects ../apt/dists/versionName/[artifacts] but oclif wants versions/sha/apt/[artifacts]
                // see https://github.com/oclif/oclif/issues/347 for the AWS-redirect that solves this
                // this workaround puts the code in both places that the redirect was doing
                // with this, the docs are correct. The copies are all done in parallel so it shouldn't be too costly.
                const workaroundKey = `${cloudChannelKey('apt/')}./${artifact}`;
                return [
                    aws_1.default.s3.copyObject({
                        ...awsDefaults,
                        CopySource: debCopySource,
                        Key: debKey,
                    }, {
                        dryRun: flags['dry-run'],
                        ignoreMissing: flags['ignore-missing'],
                        namespace: debKey,
                    }),
                    aws_1.default.s3.copyObject({
                        ...awsDefaults,
                        CopySource: debCopySource,
                        Key: workaroundKey,
                    }, {
                        dryRun: flags['dry-run'],
                        ignoreMissing: flags['ignore-missing'],
                        namespace: workaroundKey,
                    }),
                ];
            }));
        };
        await Promise.all([
            ...buildConfig.targets.flatMap((target) => [
                // always promote the manifest and gz
                promoteManifest(target),
                promoteGzTarballs(target),
            ]),
            ...(flags.xz ? buildConfig.targets.map((target) => promoteXzTarballs(target)) : []),
            ...(flags.macos ? [promoteMacInstallers()] : []),
            ...(flags.win ? [promoteWindowsInstallers()] : []),
            ...(flags.deb ? [promoteDebianAptPackages()] : []),
        ]);
    }
}
exports.default = Promote;

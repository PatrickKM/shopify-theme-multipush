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
exports.TARGETS = void 0;
exports.gitSha = gitSha;
exports.buildConfig = buildConfig;
const core_1 = require("@oclif/core");
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = require("node:util");
const semver = __importStar(require("semver"));
const upload_util_1 = require("../upload-util");
const util_1 = require("../util");
const exec = (0, node_util_1.promisify)(node_child_process_1.exec);
exports.TARGETS = [
    'linux-x64',
    'linux-arm',
    'linux-arm64',
    'win32-x64',
    'win32-x86',
    'win32-arm64',
    'darwin-x64',
    'darwin-arm64',
];
const DEFAULT_TAR_FLAGS = { win32: '--force-local' };
async function gitSha(cwd, options = {}) {
    const args = options.short ? ['rev-parse', '--short', 'HEAD'] : ['rev-parse', 'HEAD'];
    const { stdout } = await exec(`git ${args.join(' ')}`, { cwd });
    return stdout.trim();
}
async function Tmp(config) {
    const tmp = node_path_1.default.join(config.root, 'tmp');
    await (0, promises_1.mkdir)(tmp, { recursive: true });
    return tmp;
}
async function buildConfig(root, options = {}) {
    const config = await core_1.Config.load({ devPlugins: false, root: node_path_1.default.resolve(root), userPlugins: false });
    root = config.root;
    const _gitSha = options.sha ?? (await gitSha(root, { short: true }));
    // eslint-disable-next-line new-cap
    const tmp = await Tmp(config);
    const updateConfig = (config.pjson.oclif.update || {});
    updateConfig.s3 = updateConfig.s3 || {};
    const nodeVersion = updateConfig.node?.version || process.versions.node;
    const nodeOptions = (0, util_1.castArray)((updateConfig.node ?? {}).options ?? []);
    const targets = (0, util_1.compact)(options.targets || updateConfig.node?.targets || exports.TARGETS)
        .filter((t) => {
        if (t === 'darwin-arm64' && semver.lt(nodeVersion, '16.0.0')) {
            core_1.ux.warn('darwin-arm64 is only supported for node >=16.0.0. Skipping...');
            return false;
        }
        if (t === 'linux-arm' && semver.gt(nodeVersion, '24.0.0')) {
            core_1.ux.warn('linux-arm is not supported for Node.js 24 and later. Skipping...');
            return false;
        }
        if (t === 'win32-x86' && semver.gt(nodeVersion, '24.0.0')) {
            core_1.ux.warn('win32-x86 is not supported for Node.js 24 and later. Skipping...');
            return false;
        }
        if (t === 'win32-arm64' && semver.lt(nodeVersion, '20.0.0')) {
            core_1.ux.warn('win32-arm64 is only supported for node >=20.0.0. Skipping...');
            return false;
        }
        return true;
    })
        .map((t) => {
        const [platform, arch] = t.split('-');
        return { arch, platform };
    });
    const s3Config = {
        ...updateConfig.s3,
        acl: updateConfig.s3.acl,
    };
    const existingTarFlags = config.pjson.oclif.tarFlags;
    const tarFlags = existingTarFlags ? { ...DEFAULT_TAR_FLAGS, ...existingTarFlags } : DEFAULT_TAR_FLAGS;
    return {
        config,
        dist: (...args) => node_path_1.default.join(config.root, 'dist', ...args),
        gitSha: _gitSha,
        nodeOptions,
        nodeVersion,
        root,
        s3Config,
        tarFlags,
        targets,
        tmp,
        updateConfig,
        workspace(target) {
            const base = node_path_1.default.join(config.root, 'tmp');
            if (target && target.platform)
                return node_path_1.default.join(base, [target.platform, target.arch].join('-'), (0, upload_util_1.templateShortKey)('baseDir', { bin: config.bin }));
            return node_path_1.default.join(base, (0, upload_util_1.templateShortKey)('baseDir', { bin: config.bin }));
        },
        xz: options?.xz ?? updateConfig?.s3?.xz ?? true,
    };
}

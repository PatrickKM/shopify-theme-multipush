"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNodeBinary = fetchNodeBinary;
const async_retry_1 = __importDefault(require("async-retry"));
const fs_extra_1 = require("fs-extra");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const promises_2 = require("node:stream/promises");
const node_util_1 = require("node:util");
const log_1 = require("../log");
const util_1 = require("../util");
const exec = (0, node_util_1.promisify)(node_child_process_1.exec);
const RETRY_TIMEOUT_MS = 1000;
async function fetchNodeBinary({ arch, nodeVersion, output, platform, tmp }) {
    if (arch === 'arm')
        arch = 'armv7l';
    let nodeBase = `node-v${nodeVersion}-${platform}-${arch}`;
    let tarball = node_path_1.default.join(tmp, 'node', `${nodeBase}.tar.xz`);
    let url = `https://nodejs.org/dist/v${nodeVersion}/${nodeBase}.tar.xz`;
    if (platform === 'win32') {
        await (0, util_1.checkFor7Zip)();
        nodeBase = `node-v${nodeVersion}-win-${arch}`;
        tarball = node_path_1.default.join(tmp, 'node', `${nodeBase}.7z`);
        url = `https://nodejs.org/dist/v${nodeVersion}/${nodeBase}.7z`;
        output += '.exe';
    }
    let cache = node_path_1.default.join(tmp, 'cache', `node-v${nodeVersion}-${platform}-${arch}`);
    if (platform === 'win32')
        cache += '.exe';
    const download = async () => {
        (0, log_1.log)(`downloading ${nodeBase} (${url})`);
        await Promise.all([(0, fs_extra_1.ensureDir)(node_path_1.default.join(tmp, 'cache', nodeVersion)), (0, fs_extra_1.ensureDir)(node_path_1.default.join(tmp, 'node'))]);
        const shasums = node_path_1.default.join(tmp, 'cache', nodeVersion, 'SHASUMS256.txt.asc');
        const { default: got } = await import('got');
        if (!(0, node_fs_1.existsSync)(shasums)) {
            await (0, promises_2.pipeline)(got.stream(`https://nodejs.org/dist/v${nodeVersion}/SHASUMS256.txt.asc`), (0, node_fs_1.createWriteStream)(shasums));
        }
        const basedir = node_path_1.default.dirname(tarball);
        await (0, promises_1.mkdir)(basedir, { recursive: true });
        await (0, promises_2.pipeline)(got.stream(url), (0, node_fs_1.createWriteStream)(tarball));
        if (platform !== 'win32')
            await exec(`grep "${node_path_1.default.basename(tarball)}" "${shasums}" | shasum -a 256 -c -`, { cwd: basedir });
    };
    const extract = async () => {
        (0, log_1.log)(`extracting ${nodeBase}`);
        const nodeTmp = node_path_1.default.join(tmp, 'node');
        await (0, promises_1.mkdir)(nodeTmp, { recursive: true });
        await (0, promises_1.mkdir)(node_path_1.default.dirname(cache), { recursive: true });
        if (platform === 'win32') {
            await exec(`7z x -bd -y "${tarball}"`, { cwd: nodeTmp });
            await (0, fs_extra_1.move)(node_path_1.default.join(nodeTmp, nodeBase, 'node.exe'), node_path_1.default.join(cache, 'node.exe'));
        }
        else {
            await exec(`tar -C "${tmp}/node" -xJf "${tarball}"`);
            await (0, fs_extra_1.move)(node_path_1.default.join(nodeTmp, nodeBase, 'bin', 'node'), node_path_1.default.join(cache, 'node'));
        }
    };
    if (!(0, node_fs_1.existsSync)(cache)) {
        await (0, async_retry_1.default)(download, {
            factor: 1,
            maxTimeout: RETRY_TIMEOUT_MS,
            minTimeout: RETRY_TIMEOUT_MS,
            onRetry(_e, attempt) {
                (0, log_1.log)(`retrying node download (attempt ${attempt})`);
            },
            retries: 3,
        });
        await extract();
    }
    await (0, fs_extra_1.copy)(node_path_1.default.join(cache, getFilename(platform)), output);
    return output;
}
const getFilename = (platform) => (platform === 'win32' ? 'node.exe' : 'node');

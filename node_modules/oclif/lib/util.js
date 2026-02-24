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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.prettifyPaths = exports.sortVersionsObjectByKeysDesc = void 0;
exports.castArray = castArray;
exports.uniqBy = uniqBy;
exports.compact = compact;
exports.uniq = uniq;
exports.sortBy = sortBy;
exports.checkFor7Zip = checkFor7Zip;
exports.isEmpty = isEmpty;
exports.validateBin = validateBin;
exports.isS3Compatible = isS3Compatible;
exports.getS3ChecksumConfig = getS3ChecksumConfig;
const core_1 = require("@oclif/core");
const node_child_process_1 = require("node:child_process");
const crypto = __importStar(require("node:crypto"));
const node_fs_1 = require("node:fs");
const os = __importStar(require("node:os"));
const node_util_1 = require("node:util");
const log_1 = require("./log");
const exec = (0, node_util_1.promisify)(node_child_process_1.exec);
function castArray(input) {
    if (input === undefined)
        return [];
    return Array.isArray(input) ? input : [input];
}
function uniqBy(arr, fn) {
    return arr.filter((a, i) => {
        const aVal = fn(a);
        return !arr.some((b, j) => j > i && fn(b) === aVal);
    });
}
function compact(a) {
    // eslint-disable-next-line unicorn/prefer-native-coercion-functions
    return a.filter((a) => Boolean(a));
}
function uniq(arr) {
    return [...new Set(arr)];
}
function compare(a, b) {
    a = a === undefined ? 0 : a;
    b = b === undefined ? 0 : b;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length === 0 && b.length === 0)
            return 0;
        const diff = compare(a[0], b[0]);
        if (diff !== 0)
            return diff;
        return compare(a.slice(1), b.slice(1));
    }
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
}
function sortBy(arr, fn) {
    return arr.sort((a, b) => compare(fn(a), fn(b)));
}
const sortVersionsObjectByKeysDesc = (input) => {
    const keys = Reflect.ownKeys(input).sort((a, b) => {
        const splitA = a.split('.').map((part) => Number.parseInt(part, 10));
        const splitB = b.split('.').map((part) => Number.parseInt(part, 10));
        // sort by major
        if (splitA[0] < splitB[0])
            return 1;
        if (splitA[0] > splitB[0])
            return -1;
        // sort by minor
        if (splitA[1] < splitB[1])
            return 1;
        if (splitA[1] > splitB[1])
            return -1;
        // sort by patch
        if (splitA[2] < splitB[2])
            return 1;
        if (splitA[2] > splitB[2])
            return -1;
        return 0;
    });
    const result = {};
    for (const key of keys) {
        result[key] = input[key];
    }
    return result;
};
exports.sortVersionsObjectByKeysDesc = sortVersionsObjectByKeysDesc;
const homeRegexp = new RegExp(`\\B${os.homedir().replace('/', String.raw `\/`)}`, 'g');
const curRegexp = new RegExp(`\\B${process.cwd()}`, 'g');
const prettifyPaths = (input) => (input ?? '').toString().replace(curRegexp, '.').replace(homeRegexp, '~');
exports.prettifyPaths = prettifyPaths;
const hash = async (algo, fp) => {
    const f = Array.isArray(fp) ? fp.join('') : fp;
    (0, log_1.log)('hash', algo, f);
    return new Promise((resolve, reject) => {
        const hashInProgress = crypto.createHash(algo);
        const stream = (0, node_fs_1.createReadStream)(f);
        stream.on('error', (err) => reject(err));
        stream.on('data', (chunk) => hashInProgress.update(chunk));
        stream.on('end', () => resolve(hashInProgress.digest('hex')));
    });
};
exports.hash = hash;
async function checkFor7Zip() {
    try {
        await exec('7z');
    }
    catch (error) {
        const { code } = error;
        if (code === 127)
            core_1.Errors.error('install 7-zip to package windows tarball');
        else
            throw error;
    }
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function validateBin(bin) {
    return /^[\w-]+$/.test(bin);
}
function isS3Compatible(endpoint) {
    return Boolean(endpoint && !endpoint.includes('amazonaws.com'));
}
function getS3ChecksumConfig(endpoint, envValue) {
    return envValue || (isS3Compatible(endpoint) ? 'WHEN_REQUIRED' : undefined);
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitAWSDir = commitAWSDir;
exports.channelAWSDir = channelAWSDir;
exports.templateShortKey = templateShortKey;
exports.debArch = debArch;
exports.debVersion = debVersion;
const ejs_1 = require("ejs");
const node_path_1 = __importDefault(require("node:path"));
function commitAWSDir(version, sha, s3Config) {
    let s3SubDir = s3Config.folder || '';
    if (s3SubDir !== '' && s3SubDir.slice(-1) !== '/')
        s3SubDir = `${s3SubDir}/`;
    return node_path_1.default.posix.join(s3SubDir, 'versions', version, sha);
}
function channelAWSDir(channel, s3Config) {
    let s3SubDir = s3Config.folder || '';
    if (s3SubDir !== '' && s3SubDir.slice(-1) !== '/')
        s3SubDir = `${s3SubDir}/`;
    return node_path_1.default.posix.join(s3SubDir, 'channels', channel);
}
// TODO: refactor this key name lookup helper to oclif/core
function templateShortKey(type, options) {
    if (!options)
        options = {
            root: '.',
        };
    const templates = {
        baseDir: '<%- bin %>',
        deb: '<%- bin %>_<%- versionShaRevision %>_<%- arch %>.deb',
        macos: '<%- bin %>-v<%- version %>-<%- sha %>-<%- arch %>.pkg',
        manifest: '<%- bin %>-v<%- version %>-<%- sha %>-<%- platform %>-<%- arch %>-buildmanifest',
        unversioned: '<%- bin %>-<%- platform %>-<%- arch %><%- ext %>',
        versioned: '<%- bin %>-v<%- version %>-<%- sha %>-<%- platform %>-<%- arch %><%- ext %>',
        win32: '<%- bin %>-v<%- version %>-<%- sha %>-<%- arch %>.exe',
    };
    return (0, ejs_1.render)(templates[type], { ...options });
}
function debArch(arch) {
    if (arch === 'x64')
        return 'amd64';
    if (arch === 'x86')
        return 'i386';
    if (arch === 'arm')
        return 'armel';
    if (arch === 'arm64')
        return 'arm64';
    throw new Error(`invalid arch: ${arch}`);
}
function debVersion(buildConfig) {
    return `${buildConfig.config.version.split('-')[0]}.${buildConfig.gitSha}-1`;
    // see debian_revision: https://www.debian.org/doc/debian-policy/ch-controlfields.html
}

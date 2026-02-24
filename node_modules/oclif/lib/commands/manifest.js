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
const fs_extra_1 = require("fs-extra");
const node_child_process_1 = require("node:child_process");
const os = __importStar(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
async function fileExists(filePath) {
    try {
        await (0, fs_extra_1.access)(filePath);
        return true;
    }
    catch {
        return false;
    }
}
class Manifest extends core_1.Command {
    static args = {
        path: core_1.Args.string({ default: '.', description: 'Path to plugin.' }),
    };
    static description = 'Generates plugin manifest json (oclif.manifest.json).';
    static flags = {
        jit: core_1.Flags.boolean({
            allowNo: true,
            default: true,
            summary: 'Append commands from JIT plugins in manifest.',
        }),
    };
    async run() {
        const { flags } = await this.parse(Manifest);
        try {
            (0, fs_extra_1.unlinkSync)('oclif.manifest.json');
        }
        catch { }
        const { args } = await this.parse(Manifest);
        const root = node_path_1.default.resolve(args.path);
        const packageJson = (0, fs_extra_1.readJSONSync)(node_path_1.default.join(root, 'package.json'));
        let jitPluginManifests = [];
        if (flags.jit && packageJson.oclif?.jitPlugins) {
            this.debug('jitPlugins: %s', packageJson.oclif.jitPlugins);
            const tmpDir = os.tmpdir();
            const promises = Object.entries(packageJson.oclif.jitPlugins).map(async ([jitPlugin, version]) => {
                const pluginDir = jitPlugin.replace('/', '-').replace('@', '');
                const fullPath = node_path_1.default.join(tmpDir, pluginDir);
                if (await fileExists(fullPath))
                    await (0, fs_extra_1.remove)(fullPath);
                await (0, fs_extra_1.mkdir)(fullPath, { recursive: true });
                const tarball = await this.downloadTarball(jitPlugin, version, fullPath);
                await this.executeCommand(`tar -xzf "${tarball}"`, { cwd: fullPath });
                const manifest = (await (0, fs_extra_1.readJSON)(node_path_1.default.join(fullPath, 'package', 'oclif.manifest.json')));
                for (const command of Object.values(manifest.commands)) {
                    command.pluginType = 'jit';
                }
                return manifest;
            });
            core_1.ux.action.start('Generating JIT plugin manifests');
            jitPluginManifests = await Promise.all(promises);
            core_1.ux.action.stop();
        }
        let plugin = new core_1.Plugin({
            errorOnManifestCreate: true,
            ignoreManifest: true,
            respectNoCacheDefault: true,
            root,
            type: 'core',
        });
        if (!plugin)
            throw new Error('plugin not found');
        await plugin.load();
        if (!plugin.valid) {
            const { PluginLegacy } = await import('@oclif/plugin-legacy');
            // @ts-expect-error for now because PluginLegacy doesn't use the same major of @oclif/core
            plugin = new PluginLegacy(this.config, plugin);
            await plugin.load();
        }
        if (!Array.isArray(plugin.pjson.files)) {
            this.error('The package.json has to contain a "files" array', {
                ref: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json#files',
                suggestions: [
                    'Add a "files" property in the package.json listing the paths to the files that should be included in the published package',
                ],
            });
        }
        const dotfile = plugin.pjson.files.find((f) => f.endsWith('.oclif.manifest.json'));
        const file = node_path_1.default.join(plugin.root, `${dotfile ? '.' : ''}oclif.manifest.json`);
        for (const manifest of jitPluginManifests) {
            plugin.manifest.commands = { ...plugin.manifest.commands, ...manifest.commands };
        }
        (0, fs_extra_1.writeFileSync)(file, JSON.stringify(plugin.manifest, null, 2));
        this.log(`wrote manifest to ${file}`);
        return plugin.manifest;
    }
    async downloadTarball(plugin, version, tarballStoragePath) {
        const { stderr } = await this.executeCommand(`npm pack ${plugin}@${version} --pack-destination "${tarballStoragePath}" --json`);
        // You can `npm pack` with multiple modules to download multiple at a time. There will be at least 1 if the command
        // succeeded.
        const tarballs = JSON.parse(stderr);
        if (!Array.isArray(tarballs) || tarballs.length !== 1) {
            throw new Error(`Could not download tarballs for ${plugin}. Tarball download was not in the correct format.`);
        }
        const { filename } = tarballs[0];
        return node_path_1.default.join(tarballStoragePath, filename);
    }
    async executeCommand(command, options) {
        return new Promise((resolve) => {
            (0, node_child_process_1.exec)(command, options, (error, stderr, stdout) => {
                if (error)
                    this.error(error);
                const debugString = options?.cwd
                    ? `executing command: ${command} in ${options.cwd}`
                    : `executing command: ${command}`;
                this.debug(debugString);
                this.debug(stdout);
                this.debug(stderr);
                resolve({ stderr: stderr.toString(), stdout: stdout.toString() });
            });
        });
    }
}
exports.default = Manifest;

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
const fs = __importStar(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const readme_generator_1 = __importDefault(require("../readme-generator"));
class Readme extends core_1.Command {
    static description = `The readme must have any of the following tags inside of it for it to be replaced or else it will do nothing:
# Usage
<!-- usage -->
# Commands
<!-- commands -->
# Table of contents
<!-- toc -->

Customize the code URL prefix by setting oclif.repositoryPrefix in package.json.
`;
    static flags = {
        aliases: core_1.Flags.boolean({
            allowNo: true,
            default: true,
            description: 'Include aliases in the command list.',
        }),
        'dry-run': core_1.Flags.boolean({
            description: 'Prints the generated README without modifying the file.',
        }),
        multi: core_1.Flags.boolean({
            description: 'Create a different markdown page for each topic.',
        }),
        'nested-topics-depth': core_1.Flags.integer({
            dependsOn: ['multi'],
            description: 'Max nested topics depth for multi markdown page generation. Use with --multi enabled.',
        }),
        'output-dir': core_1.Flags.string({
            aliases: ['dir'],
            default: 'docs',
            description: 'Output directory for multi docs.',
            required: true,
        }),
        'plugin-directory': core_1.Flags.string({
            description: 'Plugin directory to generate README for. Defaults to the current directory.',
        }),
        'readme-path': core_1.Flags.string({
            default: 'README.md',
            description: 'Path to the README file.',
            required: true,
        }),
        'repository-prefix': core_1.Flags.string({
            description: 'A template string used to build links to the source code.',
        }),
        'tsconfig-path': core_1.Flags.string({
            default: 'tsconfig.json',
            description: 'Path to the tsconfig file',
        }),
        version: core_1.Flags.string({
            description: 'Version to use in readme links. Defaults to the version in package.json.',
        }),
    };
    static summary = 'Adds commands to README.md in current directory.';
    flags;
    async run() {
        const { flags } = await this.parse(Readme);
        this.flags = flags;
        this.flags['plugin-directory'] ??= process.cwd();
        const readmePath = node_path_1.default.resolve(this.flags['plugin-directory'], flags['readme-path']);
        const tsConfigPath = node_path_1.default.resolve(this.flags['plugin-directory'], flags['tsconfig-path']);
        if (await fs.pathExists(tsConfigPath)) {
            const { default: JSONC } = await import('tiny-jsonc');
            const tsConfigRaw = await fs.readFile(tsConfigPath, 'utf8');
            const tsConfig = JSONC.parse(tsConfigRaw);
            const outDir = tsConfig.compilerOptions?.outDir ?? 'lib';
            if (!(await fs.pathExists(outDir))) {
                this.warn(`No compiled source found at ${outDir}. Some commands may be missing.`);
            }
        }
        const config = await core_1.Config.load({
            devPlugins: false,
            root: this.flags['plugin-directory'],
            userPlugins: false,
        });
        try {
            const p = require.resolve('@oclif/plugin-legacy', { paths: [this.flags['plugin-directory']] });
            const plugin = new core_1.Plugin({ root: p, type: 'core' });
            await plugin.load();
            config.plugins.set(plugin.name, plugin);
        }
        catch { }
        await config.runHook('init', { argv: this.argv, id: 'readme' });
        const generator = new readme_generator_1.default(config, {
            aliases: this.flags.aliases,
            dryRun: this.flags['dry-run'],
            multi: this.flags.multi,
            nestedTopicsDepth: this.flags['nested-topics-depth'],
            outputDir: this.flags['output-dir'],
            pluginDir: this.flags['plugin-directory'],
            readmePath,
            repositoryPrefix: this.flags['repository-prefix'],
            version: this.flags.version,
        });
        const readme = await generator.generate();
        if (this.flags['dry-run']) {
            this.log(readme);
        }
        return readme;
    }
}
exports.default = Readme;

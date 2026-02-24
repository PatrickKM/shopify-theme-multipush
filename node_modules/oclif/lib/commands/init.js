"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const ansis_1 = require("ansis");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const generator_1 = require("../generator");
const util_1 = require("../util");
const VALID_MODULE_TYPES = ['ESM', 'CommonJS'];
const VALID_PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm'];
function isPackageManager(d) {
    return VALID_PACKAGE_MANAGERS.includes(d);
}
function isModuleType(d) {
    return VALID_MODULE_TYPES.includes(d);
}
const FLAGGABLE_PROMPTS = {
    bin: {
        message: 'Command bin name the CLI will export',
        validate: (d) => (0, util_1.validateBin)(d) || 'Invalid bin name',
    },
    'module-type': {
        message: 'Select a module type',
        options: VALID_MODULE_TYPES,
        validate: (d) => isModuleType(d) || 'Invalid module type',
    },
    'package-manager': {
        message: 'Select a package manager',
        options: VALID_PACKAGE_MANAGERS,
        validate: (d) => isPackageManager(d) || 'Invalid package manager',
    },
    'topic-separator': {
        message: 'Select a topic separator',
        options: ['colons', 'spaces'],
        validate: (d) => d === 'colons' || d === 'spaces' || 'Invalid topic separator',
    },
};
class Generate extends generator_1.GeneratorCommand {
    static description = 'This will add the necessary oclif bin files, add oclif config to package.json, and install @oclif/core and ts-node.';
    static examples = [
        {
            command: '<%= config.bin %> <%= command.id %>',
            description: 'Initialize a new CLI in the current directory',
        },
        {
            command: '<%= config.bin %> <%= command.id %> --output-dir "/path/to/existing/project"',
            description: 'Initialize a new CLI in a different directory',
        },
        {
            command: '<%= config.bin %> <%= command.id %> --topic-separator colons --bin mycli',
            description: 'Supply answers for specific prompts',
        },
    ];
    static flaggablePrompts = FLAGGABLE_PROMPTS;
    static flags = {
        ...(0, generator_1.makeFlags)(FLAGGABLE_PROMPTS),
        'output-dir': core_1.Flags.directory({
            char: 'd',
            description: 'Directory to initialize the CLI in.',
            exists: true,
        }),
        yes: core_1.Flags.boolean({
            aliases: ['defaults'],
            char: 'y',
            description: 'Use defaults for all prompts. Individual flags will override defaults.',
        }),
    };
    static summary = 'Initialize a new oclif CLI';
    async run() {
        const outputDir = this.flags['output-dir'] ?? process.cwd();
        const location = (0, node_path_1.resolve)(outputDir);
        this.log(`Initializing oclif in ${(0, ansis_1.green)(location)}`);
        const packageJSON = (await (0, generator_1.readPJSON)(location));
        if (!packageJSON) {
            throw new core_1.Errors.CLIError(`Could not find a package.json file in ${location}`);
        }
        const bin = await this.getFlagOrPrompt({
            defaultValue: location.split(node_path_1.sep).at(-1) || '',
            name: 'bin',
            type: 'input',
        });
        const topicSeparator = await this.getFlagOrPrompt({
            defaultValue: 'spaces',
            name: 'topic-separator',
            type: 'select',
        });
        const moduleType = await this.getFlagOrPrompt({
            defaultValue: packageJSON.type === 'module' ? 'ESM' : 'CommonJS',
            async maybeOtherValue() {
                return packageJSON.type === 'module' ? 'ESM' : packageJSON.type === 'commonjs' ? 'CommonJS' : undefined;
            },
            name: 'module-type',
            type: 'select',
        });
        const packageManager = await this.getFlagOrPrompt({
            defaultValue: 'npm',
            async maybeOtherValue() {
                const rootFiles = await (0, promises_1.readdir)(location);
                if (rootFiles.includes('package-lock.json')) {
                    return 'npm';
                }
                if (rootFiles.includes('yarn.lock')) {
                    return 'yarn';
                }
                if (rootFiles.includes('pnpm-lock.yaml')) {
                    return 'pnpm';
                }
            },
            name: 'package-manager',
            type: 'select',
        });
        this.log(`Using module type ${(0, ansis_1.green)(moduleType)}`);
        this.log(`Using package manager ${(0, ansis_1.green)(packageManager)}`);
        const projectBinPath = (0, node_path_1.join)(location, 'bin');
        const templateBinPath = (0, node_path_1.join)(this.templatesDir, 'cli', moduleType.toLowerCase(), 'bin');
        await this.template((0, node_path_1.join)(templateBinPath, 'dev.cmd.ejs'), (0, node_path_1.join)(projectBinPath, 'dev.cmd'));
        await this.template((0, node_path_1.join)(templateBinPath, 'dev.js.ejs'), (0, node_path_1.join)(projectBinPath, 'dev.js'));
        await this.template((0, node_path_1.join)(templateBinPath, 'run.cmd.ejs'), (0, node_path_1.join)(projectBinPath, 'run.cmd'));
        await this.template((0, node_path_1.join)(templateBinPath, 'run.js.ejs'), (0, node_path_1.join)(projectBinPath, 'run.js'));
        if (process.platform !== 'win32') {
            await (0, generator_1.exec)(`chmod +x "${(0, node_path_1.join)(projectBinPath, 'run.js')}"`);
            await (0, generator_1.exec)(`chmod +x "${(0, node_path_1.join)(projectBinPath, 'dev.js')}"`);
        }
        const updatedPackageJSON = {
            ...packageJSON,
            bin: {
                ...packageJSON.bin,
                [bin]: './bin/run.js',
            },
            oclif: {
                bin,
                commands: './dist/commands',
                dirname: bin,
                topicSeparator: topicSeparator === 'colons' ? ':' : ' ',
                ...packageJSON.oclif,
            },
        };
        await (0, promises_1.writeFile)((0, node_path_1.join)(location, 'package.json'), JSON.stringify(updatedPackageJSON, null, 2));
        const installedDeps = Object.keys(packageJSON.dependencies ?? {});
        if (!installedDeps.includes('@oclif/core')) {
            this.log('Installing @oclif/core');
            await (0, generator_1.exec)(`${packageManager} ${packageManager === 'yarn' ? 'add' : 'install'} @oclif/core`, {
                cwd: location,
                silent: false,
            });
        }
        const allInstalledDeps = new Set([...installedDeps, ...Object.keys(packageJSON.devDependencies ?? {})]);
        if (!allInstalledDeps.has('ts-node')) {
            this.log('Installing ts-node');
            await (0, generator_1.exec)(`${packageManager} ${packageManager === 'yarn' ? 'add --dev' : 'install --save-dev'} ts-node`, {
                cwd: location,
                silent: false,
            });
        }
        if (!allInstalledDeps.has('@types/node')) {
            this.log('@types/node');
            await (0, generator_1.exec)(`${packageManager} ${packageManager === 'yarn' ? 'add --dev' : 'install --save-dev'} @types/node@^18`, {
                cwd: location,
                silent: false,
            });
        }
        this.log(`\nCreated CLI ${(0, ansis_1.green)(bin)}`);
    }
}
exports.default = Generate;

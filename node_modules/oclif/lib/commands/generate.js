"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const errors_1 = require("@oclif/core/errors");
const ansis_1 = require("ansis");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const generator_1 = require("../generator");
const log_1 = require("../log");
const util_1 = require("../util");
const debug = log_1.debug.new('generate');
async function fetchGithubUserFromAPI() {
    const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
    if (!token)
        return;
    const { default: got } = await import('got');
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
    };
    try {
        const { login, name } = await got('https://api.github.com/user', { headers }).json();
        return { login, name };
    }
    catch { }
}
async function fetchGithubUserFromGit() {
    try {
        const result = await (0, generator_1.exec)('git config --get user.name');
        return result.stdout.trim();
    }
    catch { }
}
async function fetchGithubUser() {
    return (await fetchGithubUserFromAPI()) ?? { name: await fetchGithubUserFromGit() };
}
function determineDefaultAuthor(user, defaultValue) {
    const { login, name } = user ?? { login: undefined, name: undefined };
    if (name && login)
        return `${name} @${login}`;
    if (name)
        return name;
    if (login)
        return `@${login}`;
    return defaultValue;
}
const FLAGGABLE_PROMPTS = {
    author: {
        message: 'Author',
        validate: (d) => d.length > 0 || 'Author cannot be empty',
    },
    bin: {
        message: 'Command bin name the CLI will export',
        validate: (d) => (0, util_1.validateBin)(d) || 'Invalid bin name',
    },
    description: {
        message: 'Description',
        validate: (d) => d.length > 0 || 'Description cannot be empty',
    },
    license: {
        message: 'License',
        validate: (d) => d.length > 0 || 'License cannot be empty',
    },
    'module-type': {
        message: 'Select a module type',
        options: ['CommonJS', 'ESM'],
        validate: (d) => ['CommonJS', 'ESM'].includes(d) || 'Invalid module type',
    },
    name: {
        message: 'NPM package name',
        validate: (d) => (0, validate_npm_package_name_1.default)(d).validForNewPackages || 'Invalid package name',
    },
    owner: {
        message: 'Who is the GitHub owner of repository (https://github.com/OWNER/repo)',
        validate: (d) => d.length > 0 || 'Owner cannot be empty',
    },
    'package-manager': {
        message: 'Select a package manager',
        options: ['npm', 'yarn', 'pnpm'],
        validate: (d) => ['npm', 'pnpm', 'yarn'].includes(d) || 'Invalid package manager',
    },
    repository: {
        message: 'What is the GitHub name of repository (https://github.com/owner/REPO)',
        validate: (d) => d.length > 0 || 'Repo cannot be empty',
    },
};
class Generate extends generator_1.GeneratorCommand {
    static args = {
        name: core_1.Args.string({ description: 'Directory name of new project.', required: true }),
    };
    static description = `This will generate a fully functional oclif CLI that you can build on. It will prompt you for all the necessary information to get started. If you want to skip the prompts, you can pass the --yes flag to accept the defaults for all prompts. You can also pass individual flags to set specific values for prompts.

Head to oclif.io/docs/introduction to learn more about building CLIs with oclif.`;
    static examples = [
        {
            command: '<%= config.bin %> <%= command.id %> my-cli',
            description: 'Generate a new CLI with prompts for all properties',
        },
        {
            command: '<%= config.bin %> <%= command.id %> my-cli --yes',
            description: 'Automatically accept default values for all prompts',
        },
        {
            command: '<%= config.bin %> <%= command.id %> my-cli --module-type CommonJS --author "John Doe"',
            description: 'Supply answers for specific prompts',
        },
        {
            command: '<%= config.bin %> <%= command.id %> my-cli --module-type CommonJS --author "John Doe" --yes',
            description: 'Supply answers for specific prompts and accept default values for the rest',
        },
    ];
    static flaggablePrompts = FLAGGABLE_PROMPTS;
    static flags = {
        ...(0, generator_1.makeFlags)(FLAGGABLE_PROMPTS),
        'dry-run': core_1.Flags.boolean({
            char: 'n',
            description: 'Print the files that would be created without actually creating them.',
        }),
        'output-dir': core_1.Flags.directory({
            char: 'd',
            description: 'Directory to build the CLI in.',
        }),
        yes: core_1.Flags.boolean({
            aliases: ['defaults'],
            char: 'y',
            description: 'Use defaults for all prompts. Individual flags will override defaults.',
        }),
    };
    static summary = 'Generate a new CLI';
    async run() {
        const location = this.flags['output-dir'] ? (0, node_path_1.join)(this.flags['output-dir'], this.args.name) : (0, node_path_1.resolve)(this.args.name);
        this.log(`Generating ${this.args.name} in ${(0, ansis_1.green)(location)}`);
        if ((0, node_fs_1.existsSync)(location)) {
            throw new core_1.Errors.CLIError(`The directory ${location} already exists.`);
        }
        const moduleType = await this.getFlagOrPrompt({
            defaultValue: 'ESM',
            name: 'module-type',
            type: 'select',
        });
        const githubUser = await fetchGithubUser();
        const name = await this.getFlagOrPrompt({ defaultValue: this.args.name, name: 'name', type: 'input' });
        const bin = await this.getFlagOrPrompt({ defaultValue: name, name: 'bin', type: 'input' });
        const description = await this.getFlagOrPrompt({
            defaultValue: 'A new CLI generated with oclif',
            name: 'description',
            type: 'input',
        });
        const author = await this.getFlagOrPrompt({
            defaultValue: determineDefaultAuthor(githubUser, 'Your Name Here'),
            name: 'author',
            type: 'input',
        });
        const license = await this.getFlagOrPrompt({
            defaultValue: 'MIT',
            name: 'license',
            type: 'input',
        });
        const owner = await this.getFlagOrPrompt({
            defaultValue: githubUser?.login ?? location.split(node_path_1.sep).at(-2) ?? 'Your Name Here',
            name: 'owner',
            type: 'input',
        });
        const repository = await this.getFlagOrPrompt({
            defaultValue: name.split('/').at(-1) ?? name,
            name: 'repository',
            type: 'input',
        });
        const packageManager = await this.getFlagOrPrompt({
            defaultValue: 'npm',
            name: 'package-manager',
            type: 'select',
        });
        const [sharedFiles, moduleSpecificFiles] = await Promise.all(['shared', moduleType.toLowerCase()].map((f) => (0, node_path_1.join)(this.templatesDir, 'cli', f)).map(findEjsFiles(location)));
        debug('shared files %O', sharedFiles);
        debug(`${moduleType} files %O`, moduleSpecificFiles);
        await Promise.all([...sharedFiles, ...moduleSpecificFiles].map(async (file) => {
            switch (file.name) {
                case '.gitignore.ejs': {
                    await this.template(file.src, file.destination, { packageManager });
                    break;
                }
                case 'onPushToMain.yml.ejs':
                case 'onRelease.yml.ejs':
                case 'test.yml.ejs': {
                    await this.template(file.src, file.destination, {
                        exec: packageManager === 'yarn' ? packageManager : `${packageManager} exec`,
                        install: packageManager === 'yarn' ? packageManager : `${packageManager} install`,
                        packageManager,
                        run: packageManager === 'yarn' ? packageManager : `${packageManager} run`,
                    });
                    break;
                }
                case 'package.json.ejs': {
                    const data = {
                        author,
                        bin,
                        description,
                        license,
                        moduleType,
                        name,
                        owner,
                        pkgManagerScript: packageManager === 'yarn' ? 'yarn' : `${packageManager} run`,
                        repository,
                    };
                    await this.template(file.src, file.destination, data);
                    break;
                }
                case 'README.md.ejs': {
                    await this.template(file.src, file.destination, { description, name, repository });
                    break;
                }
                default: {
                    await this.template(file.src, file.destination);
                }
            }
        }));
        if (this.flags['dry-run']) {
            this.log(`\n[DRY RUN] Created ${(0, ansis_1.green)(name)}`);
        }
        else {
            if (process.platform !== 'win32') {
                await Promise.all([
                    (0, generator_1.exec)(`chmod +x ${(0, node_path_1.join)(location, 'bin', 'run.js')}`),
                    (0, generator_1.exec)(`chmod +x ${(0, node_path_1.join)(location, 'bin', 'dev.js')}`),
                ]);
            }
            await (0, generator_1.exec)(`${packageManager} install`, { cwd: location, silent: false });
            await (0, generator_1.exec)(`${packageManager} run build`, { cwd: location, silent: false });
            await (0, generator_1.exec)(`${(0, node_path_1.join)(location, 'node_modules', '.bin', 'oclif')} readme`, {
                cwd: location,
                // When testing this command in development, you get noisy compilation errors as a result of running
                // this in a spawned process. Setting the NODE_ENV to production will silence these warnings. This
                // doesn't affect the behavior of the command in production since the NODE_ENV is already set to production
                // in that scenario.
                env: { ...process.env, NODE_ENV: 'production' },
                silent: false,
            });
            this.log(`\nCreated ${(0, ansis_1.green)(name)}`);
        }
    }
}
exports.default = Generate;
const findEjsFiles = (location) => async (dir) => (await (0, promises_1.readdir)(dir, { recursive: true, withFileTypes: true }))
    .filter((f) => f.isFile() && f.name.endsWith('.ejs'))
    .map((f) => {
    debug({
        location,
        name: f.name,
        parentPath: f.parentPath,
        path: f.path,
    });
    const path = f.path ?? f.parentPath;
    if (!path) {
        (0, errors_1.warn)(`Could not determine path for file ${f.name}. Skipping.`);
        return null;
    }
    return {
        destination: (0, node_path_1.join)(path.replace(dir, location), f.name.replace('.ejs', '')),
        name: f.name,
        src: (0, node_path_1.join)(path, f.name),
    };
})
    .filter((f) => f !== null);

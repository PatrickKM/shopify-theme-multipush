"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorCommand = void 0;
exports.exec = exec;
exports.readPJSON = readPJSON;
exports.makeFlags = makeFlags;
const core_1 = require("@oclif/core");
const ansis_1 = __importDefault(require("ansis"));
const ejs_1 = require("ejs");
const fs_extra_1 = require("fs-extra");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const log_1 = require("./log");
const debug = log_1.debug.new(`generator`);
async function exec(command, opts) {
    const silent = opts ? opts.silent : true;
    return new Promise((resolve, reject) => {
        if (!silent)
            core_1.ux.stdout(ansis_1.default.dim(command));
        const p = (0, node_child_process_1.exec)(command, opts ?? {}, (err, stdout, stderr) => {
            if (err)
                return reject(err);
            resolve({ stderr, stdout });
        });
        if (!silent)
            p.stdout?.pipe(process.stdout);
        if (!silent)
            p.stderr?.pipe(process.stderr);
    });
}
async function readPJSON(location) {
    try {
        const packageJSON = await (0, promises_1.readFile)((0, node_path_1.join)(location, 'package.json'), 'utf8');
        return JSON.parse(packageJSON);
    }
    catch { }
}
function validateInput(input, validate) {
    const result = validate(input);
    if (typeof result === 'string')
        throw new Error(result);
    return input;
}
function makeFlags(flaggablePrompts) {
    return Object.fromEntries(Object.entries(flaggablePrompts).map(([key, value]) => [
        key,
        core_1.Flags.string({
            description: `Supply answer for prompt: ${value.message}`,
            options: value.options,
            async parse(input) {
                return validateInput(input, value.validate);
            },
        }),
    ]));
}
class GeneratorCommand extends core_1.Command {
    args;
    flaggablePrompts;
    flags;
    templatesDir;
    /**
     * Get a flag value or prompt the user for a value.
     *
     * Resolution order:
     * - Flag value provided by the user
     * - Value returned by `maybeOtherValue`
     * - `defaultValue` if the `--yes` flag is provided
     * - Prompt the user for a value
     */
    async getFlagOrPrompt({ defaultValue, maybeOtherValue, name, type }) {
        if (!this.flaggablePrompts)
            throw new Error('No flaggable prompts defined');
        if (!this.flaggablePrompts[name])
            throw new Error(`No flaggable prompt defined for ${name}`);
        const maybeFlag = () => {
            if (this.flags[name]) {
                this.log(`${ansis_1.default.green('?')} ${ansis_1.default.bold(this.flaggablePrompts[name].message)} ${ansis_1.default.cyan(this.flags[name])}`);
                return this.flags[name];
            }
        };
        const maybeDefault = () => {
            if (this.flags.yes) {
                this.log(`${ansis_1.default.green('?')} ${ansis_1.default.bold(this.flaggablePrompts[name].message)} ${ansis_1.default.cyan(defaultValue)}`);
                return defaultValue;
            }
        };
        const checkMaybeOtherValue = async () => {
            if (!maybeOtherValue)
                return;
            const otherValue = await maybeOtherValue();
            if (otherValue) {
                this.log(`${ansis_1.default.green('?')} ${ansis_1.default.bold(this.flaggablePrompts[name].message)} ${ansis_1.default.cyan(otherValue)}`);
                return otherValue;
            }
        };
        switch (type) {
            case 'input': {
                return (maybeFlag() ??
                    (await checkMaybeOtherValue()) ??
                    maybeDefault() ??
                    // Dynamic import because @inquirer/input is ESM only. Once oclif is ESM, we can make this a normal import
                    // so that we can avoid importing on every single question.
                    (await import('@inquirer/input')).default({
                        default: defaultValue,
                        message: this.flaggablePrompts[name].message,
                        validate: this.flaggablePrompts[name].validate,
                    }));
            }
            case 'select': {
                return (maybeFlag() ??
                    (await checkMaybeOtherValue()) ??
                    maybeDefault() ??
                    // Dynamic import because @inquirer/select is ESM only. Once oclif is ESM, we can make this a normal import
                    // so that we can avoid importing on every single question.
                    (await import('@inquirer/select')).default({
                        choices: (this.flaggablePrompts[name].options ?? []).map((o) => ({ name: o, value: o })),
                        default: defaultValue,
                        message: this.flaggablePrompts[name].message,
                    }));
            }
            default: {
                throw new Error('Invalid type');
            }
        }
    }
    async init() {
        await super.init();
        const { args, flags } = await this.parse({
            args: this.ctor.args,
            baseFlags: super.ctor.baseFlags,
            enableJsonFlag: this.ctor.enableJsonFlag,
            flags: this.ctor.flags,
            strict: this.ctor.strict,
        });
        this.flags = flags;
        this.args = args;
        // @ts-expect-error because we trust that child classes will set this - also, it's okay if they don't
        this.flaggablePrompts = this.ctor.flaggablePrompts ?? {};
        this.templatesDir = (0, node_path_1.join)(__dirname, '../templates');
        debug(`Templates directory: ${this.templatesDir}`);
    }
    async template(source, destination, data) {
        if (this.flags['dry-run']) {
            debug('[DRY RUN] Rendering template %s to %s', source, destination);
        }
        else {
            debug('Rendering template %s to %s', source, destination);
        }
        const rendered = await new Promise((resolve, reject) => {
            (0, ejs_1.renderFile)(source, data ?? {}, (err, str) => {
                if (err)
                    reject(err);
                return resolve(str);
            });
        });
        let verb = 'Creating';
        if (rendered) {
            const relativePath = (0, node_path_1.relative)(process.cwd(), destination);
            if ((0, node_fs_1.existsSync)(destination)) {
                const confirmation = this.flags.force ??
                    (await (await import('@inquirer/confirm')).default({
                        message: `Overwrite ${relativePath}?`,
                    }));
                if (confirmation) {
                    verb = 'Overwriting';
                }
                else {
                    this.log(`${ansis_1.default.yellow('Skipping')} ${relativePath}`);
                    return;
                }
            }
            this.log(`${ansis_1.default.yellow(verb)} ${relativePath}`);
            if (!this.flags['dry-run']) {
                await (0, fs_extra_1.outputFile)(destination, rendered);
            }
        }
    }
}
exports.GeneratorCommand = GeneratorCommand;

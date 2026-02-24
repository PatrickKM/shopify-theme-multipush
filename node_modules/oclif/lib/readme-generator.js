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
const debug_1 = __importDefault(require("debug"));
const ejs_1 = require("ejs");
const fs = __importStar(require("fs-extra"));
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const normalize_package_data_1 = __importDefault(require("normalize-package-data"));
const help_compatibility_1 = require("./help-compatibility");
const columns = Number.parseInt(process.env.COLUMNS, 10) || 120;
const util_1 = require("./util");
const debug = (0, debug_1.default)('readme');
async function slugify(str) {
    const { default: GithubSlugger } = await import('github-slugger');
    const slugify = new GithubSlugger();
    return slugify.slug(str);
}
class ReadmeGenerator {
    config;
    options;
    constructor(config, options) {
        this.config = config;
        this.options = options;
    }
    commandCode(c) {
        const pluginName = c.pluginName;
        if (!pluginName)
            return;
        const plugin = this.config.plugins.get(pluginName);
        if (!plugin)
            return;
        const repo = this.repo(plugin);
        if (!repo)
            return;
        let label = plugin.name;
        let version = plugin.version;
        const commandPath = this.commandPath(plugin, c);
        if (!commandPath)
            return;
        if (this.config.name === plugin.name) {
            label = commandPath;
            version = this.options.version || version;
        }
        const template = this.options.repositoryPrefix ||
            plugin.pjson.oclif.repositoryPrefix ||
            '<%- repo %>/blob/v<%- version %>/<%- commandPath %>';
        return `_See code: [${label}](${(0, ejs_1.render)(template, { c, commandPath, config: this.config, repo, version })})_`;
    }
    async commands(commands) {
        const helpClass = await (0, core_1.loadHelpClass)(this.config);
        return [
            ...(await Promise.all(commands.map(async (c) => {
                const usage = this.commandUsage(c);
                return usage
                    ? `* [\`${this.config.bin} ${usage}\`](#${await slugify(`${this.config.bin}-${usage}`)})`
                    : `* [\`${this.config.bin}\`](#${await slugify(`${this.config.bin}`)})`;
            }))),
            '',
            ...commands.map((c) => this.renderCommand({ ...c }, helpClass)).map((s) => s.trim() + '\n'),
        ]
            .join('\n')
            .trim();
    }
    async createTopicFile(file, topic, commands) {
        const bin = `\`${this.config.bin} ${topic.name}\``;
        const doc = [
            bin,
            '='.repeat(bin.length),
            '',
            (0, ejs_1.render)(topic.description || '', { config: this.config }).trim(),
            '',
            await this.commands(commands),
        ]
            .join('\n')
            .trim() + '\n';
        await this.write(node_path_1.default.resolve(this.options.pluginDir ?? process.cwd(), file), doc);
    }
    async generate() {
        let readme = await this.read();
        const commands = (0, util_1.uniqBy)(this.config.commands
            .filter((c) => !c.hidden && c.pluginType === 'core')
            .filter((c) => (this.options.aliases ? true : !c.aliases.includes(c.id)))
            .map((c) => (this.config.isSingleCommandCLI ? { ...c, id: '' } : c))
            .sort((a, b) => a.id.localeCompare(b.id)), (c) => c.id);
        debug('commands:', commands.map((c) => c.id).length);
        readme = this.replaceTag(readme, 'usage', this.usage());
        readme = this.replaceTag(readme, 'commands', this.options.multi
            ? await this.multiCommands(commands, this.options.outputDir, this.options.nestedTopicsDepth)
            : await this.commands(commands));
        readme = this.replaceTag(readme, 'toc', await this.tableOfContents(readme));
        readme = readme.trimEnd();
        readme += '\n';
        await this.write(this.options.readmePath, readme);
        return readme;
    }
    async multiCommands(commands, dir, nestedTopicsDepth) {
        let topics = this.config.topics;
        topics = nestedTopicsDepth
            ? topics.filter((t) => !t.hidden && (t.name.match(/:/g) || []).length < nestedTopicsDepth)
            : topics.filter((t) => !t.hidden && !t.name.includes(':'));
        topics = topics.filter((t) => commands.find((c) => c.id.startsWith(t.name)));
        topics = (0, util_1.uniqBy)((0, util_1.sortBy)(topics, (t) => t.name), (t) => t.name);
        for (const topic of topics) {
            // eslint-disable-next-line no-await-in-loop
            await this.createTopicFile(node_path_1.default.join('.', dir, topic.name.replaceAll(':', '/') + '.md'), topic, commands.filter((c) => c.id === topic.name || c.id.startsWith(topic.name + ':')));
        }
        return ([
            '# Command Topics\n',
            ...topics.map((t) => (0, util_1.compact)([
                `* [\`${this.config.bin} ${t.name.replaceAll(':', this.config.topicSeparator)}\`](${dir}/${t.name.replaceAll(':', '/')}.md)`,
                (0, ejs_1.render)(t.description || '', { config: this.config })
                    .trim()
                    .split('\n')[0],
            ]).join(' - ')),
        ]
            .join('\n')
            .trim() + '\n');
    }
    async read() {
        return (0, promises_1.readFile)(this.options.readmePath, 'utf8');
    }
    renderCommand(c, HelpClass) {
        debug('rendering command', c.id);
        const title = (0, ejs_1.render)(c.summary ?? c.description ?? '', { command: c, config: this.config })
            .trim()
            .split('\n')[0];
        const help = new HelpClass(this.config, { maxWidth: columns, respectNoCacheDefault: true, stripAnsi: true });
        const wrapper = new help_compatibility_1.HelpCompatibilityWrapper(help);
        const header = () => {
            const usage = this.commandUsage(c);
            return usage ? `## \`${this.config.bin} ${usage}\`` : `## \`${this.config.bin}\``;
        };
        try {
            // copy c to keep the command ID with colons, see:
            // https://github.com/oclif/oclif/pull/1165#discussion_r1282305242
            const command = { ...c };
            return (0, util_1.compact)([
                header(),
                title,
                '```\n' + wrapper.formatCommand(c).trim() + '\n```',
                this.commandCode(command),
            ]).join('\n\n');
        }
        catch (error) {
            const { message } = error;
            core_1.ux.error(message);
        }
    }
    replaceTag(readme, tag, body) {
        if (readme.includes(`<!-- ${tag} -->`)) {
            if (readme.includes(`<!-- ${tag}stop -->`)) {
                readme = readme.replace(new RegExp(`<!-- ${tag} -->(.|\n)*<!-- ${tag}stop -->`, 'm'), `<!-- ${tag} -->`);
            }
            core_1.ux.stdout(`replacing <!-- ${tag} --> in ${this.options.readmePath}`);
        }
        return readme.replace(`<!-- ${tag} -->`, `<!-- ${tag} -->\n${body}\n<!-- ${tag}stop -->`);
    }
    async tableOfContents(readme) {
        const toc = await Promise.all(readme
            .split('\n')
            .filter((l) => l.startsWith('# '))
            .map((l) => l.trim().slice(2))
            .map(async (l) => `* [${l}](#${await slugify(l)})`));
        return toc.join('\n');
    }
    usage() {
        const versionFlags = ['--version', ...(this.config.pjson.oclif.additionalVersionFlags ?? []).sort()];
        const versionFlagsString = `(${versionFlags.join('|')})`;
        return [
            `\`\`\`sh-session
$ npm install -g ${this.config.name}
$ ${this.config.bin} COMMAND
running command...
$ ${this.config.bin} ${versionFlagsString}
${this.config.name}/${this.options.version || this.config.version} ${process.platform}-${process.arch} node-v${process.versions.node}
$ ${this.config.bin} --help [COMMAND]
USAGE
  $ ${this.config.bin} COMMAND
...
\`\`\`\n`,
        ]
            .join('\n')
            .trim();
    }
    async write(file, content) {
        if (!this.options.dryRun)
            await fs.outputFile(file, content);
    }
    /**
     * fetches the path to a command
     */
    // eslint-disable-next-line complexity
    commandPath(plugin, c) {
        const strategy = typeof plugin.pjson.oclif?.commands === 'string' ? 'pattern' : plugin.pjson.oclif?.commands?.strategy;
        // if the strategy is explicit, we can't determine the path so return undefined
        if (strategy === 'explicit')
            return;
        const commandsDir = typeof plugin.pjson.oclif?.commands === 'string'
            ? plugin.pjson.oclif?.commands
            : plugin.pjson.oclif?.commands?.target;
        if (!commandsDir)
            return;
        const hasTypescript = plugin.pjson.devDependencies?.typescript || plugin.pjson.dependencies?.typescript;
        let p = node_path_1.default.join(plugin.root, commandsDir, ...c.id.split(':'));
        const outDir = node_path_1.default.dirname(commandsDir.replace(/^.\/|.\\/, '')); // remove leading ./ or .\ from path
        const outDirRegex = new RegExp('^' + outDir + (node_path_1.default.sep === '\\' ? '\\\\' : node_path_1.default.sep));
        if (fs.pathExistsSync(node_path_1.default.join(p, 'index.js'))) {
            p = node_path_1.default.join(p, 'index.js');
        }
        else if (fs.pathExistsSync(p + '.js')) {
            p += '.js';
        }
        else if (hasTypescript) {
            // check if non-compiled scripts are available
            const base = p.replace(plugin.root + node_path_1.default.sep, '');
            p = node_path_1.default.join(plugin.root, base.replace(outDirRegex, 'src' + node_path_1.default.sep));
            if (fs.pathExistsSync(node_path_1.default.join(p, 'index.ts'))) {
                p = node_path_1.default.join(p, 'index.ts');
            }
            else if (fs.pathExistsSync(p + '.ts')) {
                p += '.ts';
            }
            else
                return;
        }
        else
            return;
        p = p.replace(plugin.root + node_path_1.default.sep, '');
        if (hasTypescript) {
            p = p.replace(outDirRegex, 'src' + node_path_1.default.sep).replace(/\.js$/, '.ts');
        }
        p = p.replaceAll('\\', '/'); // Replace windows '\' by '/'
        return p;
    }
    commandUsage(command) {
        const arg = (arg) => {
            const name = arg.name.toUpperCase();
            if (arg.required)
                return `${name}`;
            return `[${name}]`;
        };
        const id = (0, core_1.toConfiguredId)(command.id, this.config);
        const defaultUsage = () => (0, util_1.compact)([
            id,
            Object.values(command.args)
                .filter((a) => !a.hidden)
                .map((a) => arg(a))
                .join(' '),
        ]).join(' ');
        const usages = (0, util_1.castArray)(command.usage);
        return (0, ejs_1.render)(usages.length === 0 ? defaultUsage() : usages[0], { command, config: this.config });
    }
    repo(plugin) {
        const pjson = { ...plugin.pjson };
        (0, normalize_package_data_1.default)(pjson);
        const repo = pjson.repository && pjson.repository.url;
        if (!repo)
            return;
        const url = new node_url_1.URL(repo);
        if (!['github.com', 'gitlab.com'].includes(url.hostname) &&
            !pjson.oclif.repositoryPrefix &&
            !this.options.repositoryPrefix)
            return;
        return `https://${url.hostname}${url.pathname.replace(/\.git$/, '')}`;
    }
}
exports.default = ReadmeGenerator;

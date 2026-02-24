import { Command, Config, HelpBase, Interfaces } from '@oclif/core';
interface HelpBaseDerived {
    new (config: Interfaces.Config, opts?: Partial<Interfaces.HelpOptions>): HelpBase;
}
type Options = {
    aliases?: boolean;
    dryRun?: boolean;
    multi?: boolean;
    nestedTopicsDepth?: number;
    outputDir: string;
    pluginDir?: string;
    readmePath: string;
    repositoryPrefix?: string;
    version?: string;
};
export default class ReadmeGenerator {
    private config;
    private options;
    constructor(config: Config, options: Options);
    protected commandCode(c: Command.Cached): string | undefined;
    protected commands(commands: Command.Cached[]): Promise<string>;
    protected createTopicFile(file: string, topic: Interfaces.Topic, commands: Command.Cached[]): Promise<void>;
    generate(): Promise<string>;
    protected multiCommands(commands: Command.Cached[], dir: string, nestedTopicsDepth: number | undefined): Promise<string>;
    protected read(): Promise<string>;
    protected renderCommand(c: Command.Cached, HelpClass: HelpBaseDerived): string;
    protected replaceTag(readme: string, tag: string, body: string): string;
    protected tableOfContents(readme: string): Promise<string>;
    protected usage(): string;
    protected write(file: string, content: string): Promise<void>;
    /**
     * fetches the path to a command
     */
    private commandPath;
    private commandUsage;
    private repo;
}
export {};

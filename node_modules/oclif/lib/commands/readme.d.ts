import { Command, Interfaces } from '@oclif/core';
export default class Readme extends Command {
    static description: string;
    static flags: {
        aliases: Interfaces.BooleanFlag<boolean>;
        'dry-run': Interfaces.BooleanFlag<boolean>;
        multi: Interfaces.BooleanFlag<boolean>;
        'nested-topics-depth': Interfaces.OptionFlag<number | undefined, Interfaces.CustomOptions>;
        'output-dir': Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        'plugin-directory': Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        'readme-path': Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        'repository-prefix': Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        'tsconfig-path': Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        version: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
    };
    static summary: string;
    private flags;
    run(): Promise<string>;
}

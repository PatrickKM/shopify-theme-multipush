import { Command, Interfaces } from '@oclif/core';
export default class PackMacos extends Command {
    static description: string;
    static flags: {
        'additional-cli': Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        'prune-lockfiles': Interfaces.BooleanFlag<boolean>;
        root: Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        sha: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        tarball: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        targets: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
    };
    static summary: string;
    run(): Promise<void>;
}

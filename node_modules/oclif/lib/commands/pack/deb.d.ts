import { Command, Interfaces } from '@oclif/core';
export default class PackDeb extends Command {
    static description: string;
    static flags: {
        compression: Interfaces.OptionFlag<"xz" | "none" | "gzip" | "zstd" | undefined, Interfaces.CustomOptions>;
        'prune-lockfiles': Interfaces.BooleanFlag<boolean>;
        root: Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        sha: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        tarball: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
    };
    static summary: string;
    run(): Promise<void>;
}

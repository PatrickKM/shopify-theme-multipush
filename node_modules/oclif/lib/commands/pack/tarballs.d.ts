import { Command } from '@oclif/core';
export default class PackTarballs extends Command {
    static description: string;
    static flags: {
        parallel: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'prune-lockfiles': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        root: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        sha: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        tarball: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        targets: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        xz: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    static summary: string;
    run(): Promise<void>;
}

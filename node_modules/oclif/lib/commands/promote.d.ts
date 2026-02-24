import { Command } from '@oclif/core';
export default class Promote extends Command {
    static description: string;
    static flags: {
        channel: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        deb: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'dry-run': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'ignore-missing': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        indexes: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        macos: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'max-age': import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        root: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        sha: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        targets: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        version: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        win: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        xz: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}

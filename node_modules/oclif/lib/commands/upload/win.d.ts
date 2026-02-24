import { Command } from '@oclif/core';
export default class UploadWin extends Command {
    static description: string;
    static flags: {
        'dry-run': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        root: import("@oclif/core/interfaces").OptionFlag<string, import("@oclif/core/interfaces").CustomOptions>;
        sha: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        targets: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}

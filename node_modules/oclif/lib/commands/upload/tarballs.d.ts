import { Command, Interfaces } from '@oclif/core';
export default class UploadTarballs extends Command {
    static description: string;
    static flags: {
        'dry-run': Interfaces.BooleanFlag<boolean>;
        root: Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        sha: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        targets: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        xz: Interfaces.BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}

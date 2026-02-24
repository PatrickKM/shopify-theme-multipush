import { Command, Interfaces } from '@oclif/core';
export default class UploadMacos extends Command {
    static description: string;
    static flags: {
        'dry-run': Interfaces.BooleanFlag<boolean>;
        root: Interfaces.OptionFlag<string, Interfaces.CustomOptions>;
        sha: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
        targets: Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>;
    };
    run(): Promise<void>;
}

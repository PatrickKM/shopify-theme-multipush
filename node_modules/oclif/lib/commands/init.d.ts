import { GeneratorCommand } from '../generator';
export default class Generate extends GeneratorCommand<typeof Generate> {
    static description: string;
    static examples: {
        command: string;
        description: string;
    }[];
    static flaggablePrompts: {
        bin: {
            message: string;
            validate: (d: string) => true | "Invalid bin name";
        };
        'module-type': {
            message: string;
            options: readonly ["ESM", "CommonJS"];
            validate: (d: string) => true | "Invalid module type";
        };
        'package-manager': {
            message: string;
            options: readonly ["npm", "yarn", "pnpm"];
            validate: (d: string) => true | "Invalid package manager";
        };
        'topic-separator': {
            message: string;
            options: string[];
            validate: (d: string) => true | "Invalid topic separator";
        };
    };
    static flags: {
        'output-dir': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        yes: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        bin: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        "module-type": import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        "package-manager": import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        "topic-separator": import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static summary: string;
    run(): Promise<void>;
}

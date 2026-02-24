import { GeneratorCommand } from '../generator';
export default class Generate extends GeneratorCommand<typeof Generate> {
    static args: {
        name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: {
        command: string;
        description: string;
    }[];
    static flaggablePrompts: {
        author: {
            message: string;
            validate: (d: string) => true | "Author cannot be empty";
        };
        bin: {
            message: string;
            validate: (d: string) => true | "Invalid bin name";
        };
        description: {
            message: string;
            validate: (d: string) => true | "Description cannot be empty";
        };
        license: {
            message: string;
            validate: (d: string) => true | "License cannot be empty";
        };
        'module-type': {
            message: string;
            options: string[];
            validate: (d: string) => true | "Invalid module type";
        };
        name: {
            message: string;
            validate: (d: string) => true | "Invalid package name";
        };
        owner: {
            message: string;
            validate: (d: string) => true | "Owner cannot be empty";
        };
        'package-manager': {
            message: string;
            options: string[];
            validate: (d: string) => true | "Invalid package manager";
        };
        repository: {
            message: string;
            validate: (d: string) => true | "Repo cannot be empty";
        };
    };
    static flags: {
        'dry-run': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'output-dir': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        yes: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        name: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        description: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        repository: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        bin: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        author: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        license: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        "module-type": import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        owner: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        "package-manager": import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    static summary: string;
    run(): Promise<void>;
}

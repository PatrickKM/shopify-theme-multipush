import { Command, Interfaces } from '@oclif/core';
import { ExecOptions } from 'node:child_process';
export type FlaggablePrompt = {
    message: string;
    options?: readonly string[] | string[];
    validate: (d: string) => boolean | string;
};
export type FlagsOfPrompts<T extends Record<string, FlaggablePrompt>> = Record<keyof T, Interfaces.OptionFlag<string | undefined, Interfaces.CustomOptions>>;
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof GeneratorCommand)['baseFlags'] & T['flags']>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;
export type GetFlagOrPromptOptions = {
    /**
     * The default value for the prompt if the `--yes` flag is provided.
     */
    defaultValue: string;
    /**
     * A function that returns a value if the user has not provided the value via the flag. This will rerun before
     * the check for the `--yes` flag.
     */
    maybeOtherValue?: () => Promise<string | undefined>;
    /**
     * The name of the flaggable prompt. Corresponds to the key in `this.flags`.
     */
    name: string;
    /**
     * The type of prompt to display.
     */
    type: 'input' | 'select';
};
export declare function exec(command: string, opts?: ExecOptions & {
    silent?: boolean;
}): Promise<{
    stderr: string;
    stdout: string;
}>;
export declare function readPJSON(location: string): Promise<(Interfaces.PJSON & {
    scripts: Record<string, string>;
}) | undefined>;
export declare function makeFlags<T extends Record<string, FlaggablePrompt>>(flaggablePrompts: T): FlagsOfPrompts<T>;
export declare abstract class GeneratorCommand<T extends typeof Command> extends Command {
    protected args: Args<T>;
    protected flaggablePrompts: Record<string, FlaggablePrompt>;
    protected flags: Flags<T>;
    templatesDir: string;
    /**
     * Get a flag value or prompt the user for a value.
     *
     * Resolution order:
     * - Flag value provided by the user
     * - Value returned by `maybeOtherValue`
     * - `defaultValue` if the `--yes` flag is provided
     * - Prompt the user for a value
     */
    getFlagOrPrompt({ defaultValue, maybeOtherValue, name, type }: GetFlagOrPromptOptions): Promise<string>;
    init(): Promise<void>;
    template(source: string, destination: string, data?: Record<string, unknown>): Promise<void>;
}

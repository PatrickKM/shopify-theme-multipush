import { BuildConfig } from './config';
type BuildOptions = {
    pack?: boolean;
    parallel?: boolean;
    platform?: string;
    pruneLockfiles?: boolean;
    tarball?: string;
};
export declare function build(c: BuildConfig, options?: BuildOptions): Promise<void>;
export {};

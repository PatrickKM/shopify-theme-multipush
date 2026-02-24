import { BuildConfig } from './tarballs';
export declare const appendToIndex: (input: {
    dryRun?: boolean;
    filename: string;
    maxAge: string;
    originalUrl: string;
    s3Config: BuildConfig["s3Config"];
    version: string;
}) => Promise<void>;

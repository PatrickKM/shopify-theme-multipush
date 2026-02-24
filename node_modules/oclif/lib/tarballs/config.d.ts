import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { Interfaces } from '@oclif/core';
export declare const TARGETS: string[];
type TarFlags = Interfaces.OclifConfiguration['tarFlags'];
export type S3Config = BuildConfig['updateConfig']['s3'] & {
    acl?: ObjectCannedACL;
} & {
    folder?: string;
    indexVersionLimit?: number;
};
export type UpdateConfig = Interfaces.OclifConfiguration['update'] & {
    s3?: Interfaces.S3 & {
        acl?: ObjectCannedACL;
    };
};
export type BuildConfig = {
    config: Interfaces.Config;
    dist(input: string): string;
    gitSha: string;
    nodeOptions: string[];
    nodeVersion: string;
    root: string;
    s3Config: S3Config;
    tarFlags?: TarFlags;
    targets: {
        arch: Interfaces.ArchTypes;
        platform: Interfaces.PlatformTypes;
    }[];
    tmp: string;
    updateConfig: UpdateConfig;
    workspace(target?: {
        arch: Interfaces.ArchTypes;
        platform: Interfaces.PlatformTypes;
    }): string;
    xz: boolean;
};
export declare function gitSha(cwd: string, options?: {
    short?: boolean;
}): Promise<string>;
export declare function buildConfig(root: string, options?: {
    sha?: string;
    targets?: string[];
    xz?: boolean;
}): Promise<BuildConfig>;
export {};

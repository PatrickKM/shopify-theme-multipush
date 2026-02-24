export declare function castArray<T>(input?: T | T[]): T[];
export declare function uniqBy<T>(arr: T[], fn: (cur: T) => unknown): T[];
export declare function compact<T>(a: (T | undefined)[]): T[];
export declare function uniq<T>(arr: T[]): T[];
type Types = boolean | number | string | undefined;
export declare function sortBy<T>(arr: T[], fn: (i: T) => Types | Types[]): T[];
interface VersionsObject {
    [key: string]: string;
}
export declare const sortVersionsObjectByKeysDesc: (input: VersionsObject) => VersionsObject;
export declare const prettifyPaths: (input: unknown) => string;
export declare const hash: (algo: string, fp: string | string[]) => Promise<string>;
export declare function checkFor7Zip(): Promise<void>;
export declare function isEmpty(obj: Record<string, unknown>): boolean;
export declare function validateBin(bin: string): boolean;
export declare function isS3Compatible(endpoint: string | undefined): boolean;
export declare function getS3ChecksumConfig(endpoint: string | undefined, envValue: string | undefined): string | undefined;
export {};

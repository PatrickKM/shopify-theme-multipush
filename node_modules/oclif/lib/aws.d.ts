import { CreateInvalidationCommandOutput, CreateInvalidationRequest } from '@aws-sdk/client-cloudfront';
import { CopyObjectOutput, CopyObjectRequest, DeleteObjectsOutput, DeleteObjectsRequest, GetObjectOutput, GetObjectRequest, HeadObjectOutput, HeadObjectRequest, ListObjectsV2Output, ListObjectsV2Request, PutObjectOutput, PutObjectRequest } from '@aws-sdk/client-s3';
declare const _default: {
    readonly cloudfront: {
        createCloudfrontInvalidation: (options: CreateInvalidationRequest) => Promise<CreateInvalidationCommandOutput>;
    };
    readonly s3: {
        copyObject: (options: CopyObjectRequest, { dryRun, ignoreMissing, namespace }: {
            dryRun?: boolean;
            ignoreMissing?: boolean;
            namespace?: string;
        }) => Promise<CopyObjectOutput>;
        deleteObjects: (options: DeleteObjectsRequest) => Promise<DeleteObjectsOutput>;
        getObject: (options: GetObjectRequest) => Promise<GetObjectOutput>;
        headObject: (options: HeadObjectRequest) => Promise<HeadObjectOutput>;
        listObjects: (options: ListObjectsV2Request) => Promise<ListObjectsV2Output>;
        uploadFile: (local: string, options: PutObjectRequest, { dryRun }?: {
            dryRun?: boolean;
        }) => Promise<PutObjectOutput>;
    };
};
export default _default;

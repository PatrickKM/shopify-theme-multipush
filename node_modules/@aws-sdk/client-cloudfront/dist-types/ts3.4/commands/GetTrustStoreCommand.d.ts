import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import { GetTrustStoreRequest, GetTrustStoreResult } from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface GetTrustStoreCommandInput extends GetTrustStoreRequest {}
export interface GetTrustStoreCommandOutput
  extends GetTrustStoreResult,
    __MetadataBearer {}
declare const GetTrustStoreCommand_base: {
  new (
    input: GetTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetTrustStoreCommandInput,
    GetTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetTrustStoreCommandInput,
    GetTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetTrustStoreCommand extends GetTrustStoreCommand_base {
  protected static __types: {
    api: {
      input: GetTrustStoreRequest;
      output: GetTrustStoreResult;
    };
    sdk: {
      input: GetTrustStoreCommandInput;
      output: GetTrustStoreCommandOutput;
    };
  };
}

import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  CreateTrustStoreRequest,
  CreateTrustStoreResult,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateTrustStoreCommandInput extends CreateTrustStoreRequest {}
export interface CreateTrustStoreCommandOutput
  extends CreateTrustStoreResult,
    __MetadataBearer {}
declare const CreateTrustStoreCommand_base: {
  new (
    input: CreateTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateTrustStoreCommandInput,
    CreateTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateTrustStoreCommandInput,
    CreateTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateTrustStoreCommand extends CreateTrustStoreCommand_base {
  protected static __types: {
    api: {
      input: CreateTrustStoreRequest;
      output: CreateTrustStoreResult;
    };
    sdk: {
      input: CreateTrustStoreCommandInput;
      output: CreateTrustStoreCommandOutput;
    };
  };
}

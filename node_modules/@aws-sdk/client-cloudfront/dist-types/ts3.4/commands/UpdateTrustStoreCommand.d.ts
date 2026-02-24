import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  UpdateTrustStoreRequest,
  UpdateTrustStoreResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface UpdateTrustStoreCommandInput extends UpdateTrustStoreRequest {}
export interface UpdateTrustStoreCommandOutput
  extends UpdateTrustStoreResult,
    __MetadataBearer {}
declare const UpdateTrustStoreCommand_base: {
  new (
    input: UpdateTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateTrustStoreCommandInput,
    UpdateTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateTrustStoreCommandInput,
    UpdateTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateTrustStoreCommand extends UpdateTrustStoreCommand_base {
  protected static __types: {
    api: {
      input: UpdateTrustStoreRequest;
      output: UpdateTrustStoreResult;
    };
    sdk: {
      input: UpdateTrustStoreCommandInput;
      output: UpdateTrustStoreCommandOutput;
    };
  };
}

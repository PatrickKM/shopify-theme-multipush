import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import { DeleteTrustStoreRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteTrustStoreCommandInput extends DeleteTrustStoreRequest {}
export interface DeleteTrustStoreCommandOutput extends __MetadataBearer {}
declare const DeleteTrustStoreCommand_base: {
  new (
    input: DeleteTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteTrustStoreCommandInput,
    DeleteTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteTrustStoreCommandInput,
    DeleteTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteTrustStoreCommand extends DeleteTrustStoreCommand_base {
  protected static __types: {
    api: {
      input: DeleteTrustStoreRequest;
      output: {};
    };
    sdk: {
      input: DeleteTrustStoreCommandInput;
      output: DeleteTrustStoreCommandOutput;
    };
  };
}

import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  ListDistributionsByTrustStoreRequest,
  ListDistributionsByTrustStoreResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface ListDistributionsByTrustStoreCommandInput
  extends ListDistributionsByTrustStoreRequest {}
export interface ListDistributionsByTrustStoreCommandOutput
  extends ListDistributionsByTrustStoreResult,
    __MetadataBearer {}
declare const ListDistributionsByTrustStoreCommand_base: {
  new (
    input: ListDistributionsByTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDistributionsByTrustStoreCommandInput,
    ListDistributionsByTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListDistributionsByTrustStoreCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDistributionsByTrustStoreCommandInput,
    ListDistributionsByTrustStoreCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListDistributionsByTrustStoreCommand extends ListDistributionsByTrustStoreCommand_base {
  protected static __types: {
    api: {
      input: ListDistributionsByTrustStoreRequest;
      output: ListDistributionsByTrustStoreResult;
    };
    sdk: {
      input: ListDistributionsByTrustStoreCommandInput;
      output: ListDistributionsByTrustStoreCommandOutput;
    };
  };
}

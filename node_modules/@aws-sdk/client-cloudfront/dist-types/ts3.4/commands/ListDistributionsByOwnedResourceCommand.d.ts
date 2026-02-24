import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  ListDistributionsByOwnedResourceRequest,
  ListDistributionsByOwnedResourceResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface ListDistributionsByOwnedResourceCommandInput
  extends ListDistributionsByOwnedResourceRequest {}
export interface ListDistributionsByOwnedResourceCommandOutput
  extends ListDistributionsByOwnedResourceResult,
    __MetadataBearer {}
declare const ListDistributionsByOwnedResourceCommand_base: {
  new (
    input: ListDistributionsByOwnedResourceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDistributionsByOwnedResourceCommandInput,
    ListDistributionsByOwnedResourceCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListDistributionsByOwnedResourceCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDistributionsByOwnedResourceCommandInput,
    ListDistributionsByOwnedResourceCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListDistributionsByOwnedResourceCommand extends ListDistributionsByOwnedResourceCommand_base {
  protected static __types: {
    api: {
      input: ListDistributionsByOwnedResourceRequest;
      output: ListDistributionsByOwnedResourceResult;
    };
    sdk: {
      input: ListDistributionsByOwnedResourceCommandInput;
      output: ListDistributionsByOwnedResourceCommandOutput;
    };
  };
}

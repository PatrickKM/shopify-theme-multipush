import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  ListDistributionsByConnectionFunctionRequest,
  ListDistributionsByConnectionFunctionResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface ListDistributionsByConnectionFunctionCommandInput
  extends ListDistributionsByConnectionFunctionRequest {}
export interface ListDistributionsByConnectionFunctionCommandOutput
  extends ListDistributionsByConnectionFunctionResult,
    __MetadataBearer {}
declare const ListDistributionsByConnectionFunctionCommand_base: {
  new (
    input: ListDistributionsByConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDistributionsByConnectionFunctionCommandInput,
    ListDistributionsByConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: ListDistributionsByConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListDistributionsByConnectionFunctionCommandInput,
    ListDistributionsByConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListDistributionsByConnectionFunctionCommand extends ListDistributionsByConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: ListDistributionsByConnectionFunctionRequest;
      output: ListDistributionsByConnectionFunctionResult;
    };
    sdk: {
      input: ListDistributionsByConnectionFunctionCommandInput;
      output: ListDistributionsByConnectionFunctionCommandOutput;
    };
  };
}

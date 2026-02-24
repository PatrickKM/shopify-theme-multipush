import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  ListConnectionFunctionsRequest,
  ListConnectionFunctionsResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface ListConnectionFunctionsCommandInput
  extends ListConnectionFunctionsRequest {}
export interface ListConnectionFunctionsCommandOutput
  extends ListConnectionFunctionsResult,
    __MetadataBearer {}
declare const ListConnectionFunctionsCommand_base: {
  new (
    input: ListConnectionFunctionsCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListConnectionFunctionsCommandInput,
    ListConnectionFunctionsCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListConnectionFunctionsCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListConnectionFunctionsCommandInput,
    ListConnectionFunctionsCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListConnectionFunctionsCommand extends ListConnectionFunctionsCommand_base {
  protected static __types: {
    api: {
      input: ListConnectionFunctionsRequest;
      output: ListConnectionFunctionsResult;
    };
    sdk: {
      input: ListConnectionFunctionsCommandInput;
      output: ListConnectionFunctionsCommandOutput;
    };
  };
}

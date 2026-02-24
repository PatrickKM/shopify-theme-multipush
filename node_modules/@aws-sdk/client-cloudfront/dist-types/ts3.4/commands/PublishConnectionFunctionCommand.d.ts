import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  PublishConnectionFunctionRequest,
  PublishConnectionFunctionResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface PublishConnectionFunctionCommandInput
  extends PublishConnectionFunctionRequest {}
export interface PublishConnectionFunctionCommandOutput
  extends PublishConnectionFunctionResult,
    __MetadataBearer {}
declare const PublishConnectionFunctionCommand_base: {
  new (
    input: PublishConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PublishConnectionFunctionCommandInput,
    PublishConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PublishConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PublishConnectionFunctionCommandInput,
    PublishConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PublishConnectionFunctionCommand extends PublishConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: PublishConnectionFunctionRequest;
      output: PublishConnectionFunctionResult;
    };
    sdk: {
      input: PublishConnectionFunctionCommandInput;
      output: PublishConnectionFunctionCommandOutput;
    };
  };
}

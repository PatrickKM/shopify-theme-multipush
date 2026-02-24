import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  CreateConnectionFunctionRequest,
  CreateConnectionFunctionResult,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface CreateConnectionFunctionCommandInput
  extends CreateConnectionFunctionRequest {}
export interface CreateConnectionFunctionCommandOutput
  extends CreateConnectionFunctionResult,
    __MetadataBearer {}
declare const CreateConnectionFunctionCommand_base: {
  new (
    input: CreateConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateConnectionFunctionCommandInput,
    CreateConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: CreateConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    CreateConnectionFunctionCommandInput,
    CreateConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class CreateConnectionFunctionCommand extends CreateConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: CreateConnectionFunctionRequest;
      output: CreateConnectionFunctionResult;
    };
    sdk: {
      input: CreateConnectionFunctionCommandInput;
      output: CreateConnectionFunctionCommandOutput;
    };
  };
}

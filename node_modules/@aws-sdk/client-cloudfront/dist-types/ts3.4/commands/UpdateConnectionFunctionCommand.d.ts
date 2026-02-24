import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  UpdateConnectionFunctionRequest,
  UpdateConnectionFunctionResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface UpdateConnectionFunctionCommandInput
  extends UpdateConnectionFunctionRequest {}
export interface UpdateConnectionFunctionCommandOutput
  extends UpdateConnectionFunctionResult,
    __MetadataBearer {}
declare const UpdateConnectionFunctionCommand_base: {
  new (
    input: UpdateConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateConnectionFunctionCommandInput,
    UpdateConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateConnectionFunctionCommandInput,
    UpdateConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateConnectionFunctionCommand extends UpdateConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: UpdateConnectionFunctionRequest;
      output: UpdateConnectionFunctionResult;
    };
    sdk: {
      input: UpdateConnectionFunctionCommandInput;
      output: UpdateConnectionFunctionCommandOutput;
    };
  };
}

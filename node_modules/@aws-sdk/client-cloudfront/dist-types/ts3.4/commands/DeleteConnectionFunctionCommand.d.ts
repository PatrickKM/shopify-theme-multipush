import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import { DeleteConnectionFunctionRequest } from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface DeleteConnectionFunctionCommandInput
  extends DeleteConnectionFunctionRequest {}
export interface DeleteConnectionFunctionCommandOutput
  extends __MetadataBearer {}
declare const DeleteConnectionFunctionCommand_base: {
  new (
    input: DeleteConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteConnectionFunctionCommandInput,
    DeleteConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: DeleteConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    DeleteConnectionFunctionCommandInput,
    DeleteConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class DeleteConnectionFunctionCommand extends DeleteConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: DeleteConnectionFunctionRequest;
      output: {};
    };
    sdk: {
      input: DeleteConnectionFunctionCommandInput;
      output: DeleteConnectionFunctionCommandOutput;
    };
  };
}

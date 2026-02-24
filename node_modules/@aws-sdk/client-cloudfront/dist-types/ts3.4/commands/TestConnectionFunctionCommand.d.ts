import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  TestConnectionFunctionRequest,
  TestConnectionFunctionResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface TestConnectionFunctionCommandInput
  extends TestConnectionFunctionRequest {}
export interface TestConnectionFunctionCommandOutput
  extends TestConnectionFunctionResult,
    __MetadataBearer {}
declare const TestConnectionFunctionCommand_base: {
  new (
    input: TestConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    TestConnectionFunctionCommandInput,
    TestConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: TestConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    TestConnectionFunctionCommandInput,
    TestConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class TestConnectionFunctionCommand extends TestConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: TestConnectionFunctionRequest;
      output: TestConnectionFunctionResult;
    };
    sdk: {
      input: TestConnectionFunctionCommandInput;
      output: TestConnectionFunctionCommandOutput;
    };
  };
}

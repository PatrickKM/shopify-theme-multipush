import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  GetResourcePolicyRequest,
  GetResourcePolicyResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface GetResourcePolicyCommandInput
  extends GetResourcePolicyRequest {}
export interface GetResourcePolicyCommandOutput
  extends GetResourcePolicyResult,
    __MetadataBearer {}
declare const GetResourcePolicyCommand_base: {
  new (
    input: GetResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetResourcePolicyCommandInput,
    GetResourcePolicyCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetResourcePolicyCommandInput,
    GetResourcePolicyCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetResourcePolicyCommand extends GetResourcePolicyCommand_base {
  protected static __types: {
    api: {
      input: GetResourcePolicyRequest;
      output: GetResourcePolicyResult;
    };
    sdk: {
      input: GetResourcePolicyCommandInput;
      output: GetResourcePolicyCommandOutput;
    };
  };
}

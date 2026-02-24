import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  PutResourcePolicyRequest,
  PutResourcePolicyResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface PutResourcePolicyCommandInput
  extends PutResourcePolicyRequest {}
export interface PutResourcePolicyCommandOutput
  extends PutResourcePolicyResult,
    __MetadataBearer {}
declare const PutResourcePolicyCommand_base: {
  new (
    input: PutResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutResourcePolicyCommandInput,
    PutResourcePolicyCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: PutResourcePolicyCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    PutResourcePolicyCommandInput,
    PutResourcePolicyCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class PutResourcePolicyCommand extends PutResourcePolicyCommand_base {
  protected static __types: {
    api: {
      input: PutResourcePolicyRequest;
      output: PutResourcePolicyResult;
    };
    sdk: {
      input: PutResourcePolicyCommandInput;
      output: PutResourcePolicyCommandOutput;
    };
  };
}

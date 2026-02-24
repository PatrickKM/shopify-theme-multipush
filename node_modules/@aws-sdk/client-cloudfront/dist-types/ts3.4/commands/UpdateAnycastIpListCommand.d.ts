import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  UpdateAnycastIpListRequest,
  UpdateAnycastIpListResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface UpdateAnycastIpListCommandInput
  extends UpdateAnycastIpListRequest {}
export interface UpdateAnycastIpListCommandOutput
  extends UpdateAnycastIpListResult,
    __MetadataBearer {}
declare const UpdateAnycastIpListCommand_base: {
  new (
    input: UpdateAnycastIpListCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateAnycastIpListCommandInput,
    UpdateAnycastIpListCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: UpdateAnycastIpListCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    UpdateAnycastIpListCommandInput,
    UpdateAnycastIpListCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class UpdateAnycastIpListCommand extends UpdateAnycastIpListCommand_base {
  protected static __types: {
    api: {
      input: UpdateAnycastIpListRequest;
      output: UpdateAnycastIpListResult;
    };
    sdk: {
      input: UpdateAnycastIpListCommandInput;
      output: UpdateAnycastIpListCommandOutput;
    };
  };
}

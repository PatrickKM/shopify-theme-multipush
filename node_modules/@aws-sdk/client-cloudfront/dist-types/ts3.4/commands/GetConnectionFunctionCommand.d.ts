import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import { Uint8ArrayBlobAdapter } from "@smithy/util-stream";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  GetConnectionFunctionRequest,
  GetConnectionFunctionResult,
} from "../models/models_0";
export { __MetadataBearer };
export { $Command };
export interface GetConnectionFunctionCommandInput
  extends GetConnectionFunctionRequest {}
export type GetConnectionFunctionCommandOutputType = Pick<
  GetConnectionFunctionResult,
  Exclude<keyof GetConnectionFunctionResult, "ConnectionFunctionCode">
> & {
  ConnectionFunctionCode?: Uint8ArrayBlobAdapter;
};
export interface GetConnectionFunctionCommandOutput
  extends GetConnectionFunctionCommandOutputType,
    __MetadataBearer {}
declare const GetConnectionFunctionCommand_base: {
  new (
    input: GetConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetConnectionFunctionCommandInput,
    GetConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    input: GetConnectionFunctionCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    GetConnectionFunctionCommandInput,
    GetConnectionFunctionCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class GetConnectionFunctionCommand extends GetConnectionFunctionCommand_base {
  protected static __types: {
    api: {
      input: GetConnectionFunctionRequest;
      output: GetConnectionFunctionResult;
    };
    sdk: {
      input: GetConnectionFunctionCommandInput;
      output: GetConnectionFunctionCommandOutput;
    };
  };
}

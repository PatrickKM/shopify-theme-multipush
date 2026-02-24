import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";
import {
  CloudFrontClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudFrontClient";
import {
  ListTrustStoresRequest,
  ListTrustStoresResult,
} from "../models/models_1";
export { __MetadataBearer };
export { $Command };
export interface ListTrustStoresCommandInput extends ListTrustStoresRequest {}
export interface ListTrustStoresCommandOutput
  extends ListTrustStoresResult,
    __MetadataBearer {}
declare const ListTrustStoresCommand_base: {
  new (
    input: ListTrustStoresCommandInput
  ): import("@smithy/smithy-client").CommandImpl<
    ListTrustStoresCommandInput,
    ListTrustStoresCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  new (
    ...[input]: [] | [ListTrustStoresCommandInput]
  ): import("@smithy/smithy-client").CommandImpl<
    ListTrustStoresCommandInput,
    ListTrustStoresCommandOutput,
    CloudFrontClientResolvedConfig,
    ServiceInputTypes,
    ServiceOutputTypes
  >;
  getEndpointParameterInstructions(): import("@smithy/middleware-endpoint").EndpointParameterInstructions;
};
export declare class ListTrustStoresCommand extends ListTrustStoresCommand_base {
  protected static __types: {
    api: {
      input: ListTrustStoresRequest;
      output: ListTrustStoresResult;
    };
    sdk: {
      input: ListTrustStoresCommandInput;
      output: ListTrustStoresCommandOutput;
    };
  };
}

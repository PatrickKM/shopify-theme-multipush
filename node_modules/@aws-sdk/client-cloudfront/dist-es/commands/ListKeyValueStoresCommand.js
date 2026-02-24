import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { ListKeyValueStores$ } from "../schemas/schemas_0";
export { $Command };
export class ListKeyValueStoresCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "ListKeyValueStores", {})
    .n("CloudFrontClient", "ListKeyValueStoresCommand")
    .sc(ListKeyValueStores$)
    .build() {
}

import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { ListDistributionsByTrustStore$ } from "../schemas/schemas_0";
export { $Command };
export class ListDistributionsByTrustStoreCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "ListDistributionsByTrustStore", {})
    .n("CloudFrontClient", "ListDistributionsByTrustStoreCommand")
    .sc(ListDistributionsByTrustStore$)
    .build() {
}

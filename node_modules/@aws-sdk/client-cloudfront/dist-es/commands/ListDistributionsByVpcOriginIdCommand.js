import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { ListDistributionsByVpcOriginId$ } from "../schemas/schemas_0";
export { $Command };
export class ListDistributionsByVpcOriginIdCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "ListDistributionsByVpcOriginId", {})
    .n("CloudFrontClient", "ListDistributionsByVpcOriginIdCommand")
    .sc(ListDistributionsByVpcOriginId$)
    .build() {
}

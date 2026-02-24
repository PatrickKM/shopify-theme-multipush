import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { CreateDistributionWithTags$ } from "../schemas/schemas_0";
export { $Command };
export class CreateDistributionWithTagsCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "CreateDistributionWithTags", {})
    .n("CloudFrontClient", "CreateDistributionWithTagsCommand")
    .sc(CreateDistributionWithTags$)
    .build() {
}

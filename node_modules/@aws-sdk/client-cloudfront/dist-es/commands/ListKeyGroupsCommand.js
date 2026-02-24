import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { ListKeyGroups$ } from "../schemas/schemas_0";
export { $Command };
export class ListKeyGroupsCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "ListKeyGroups", {})
    .n("CloudFrontClient", "ListKeyGroupsCommand")
    .sc(ListKeyGroups$)
    .build() {
}

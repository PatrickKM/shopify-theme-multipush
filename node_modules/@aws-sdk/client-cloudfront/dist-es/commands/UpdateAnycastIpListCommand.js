import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { UpdateAnycastIpList$ } from "../schemas/schemas_0";
export { $Command };
export class UpdateAnycastIpListCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "UpdateAnycastIpList", {})
    .n("CloudFrontClient", "UpdateAnycastIpListCommand")
    .sc(UpdateAnycastIpList$)
    .build() {
}

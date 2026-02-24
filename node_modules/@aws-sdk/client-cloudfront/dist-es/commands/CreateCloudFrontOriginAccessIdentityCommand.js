import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { CreateCloudFrontOriginAccessIdentity$ } from "../schemas/schemas_0";
export { $Command };
export class CreateCloudFrontOriginAccessIdentityCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "CreateCloudFrontOriginAccessIdentity", {})
    .n("CloudFrontClient", "CreateCloudFrontOriginAccessIdentityCommand")
    .sc(CreateCloudFrontOriginAccessIdentity$)
    .build() {
}

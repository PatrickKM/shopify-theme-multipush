import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { DeleteFieldLevelEncryptionConfig$ } from "../schemas/schemas_0";
export { $Command };
export class DeleteFieldLevelEncryptionConfigCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "DeleteFieldLevelEncryptionConfig", {})
    .n("CloudFrontClient", "DeleteFieldLevelEncryptionConfigCommand")
    .sc(DeleteFieldLevelEncryptionConfig$)
    .build() {
}

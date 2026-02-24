import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { GetInvalidationForDistributionTenant$ } from "../schemas/schemas_0";
export { $Command };
export class GetInvalidationForDistributionTenantCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "GetInvalidationForDistributionTenant", {})
    .n("CloudFrontClient", "GetInvalidationForDistributionTenantCommand")
    .sc(GetInvalidationForDistributionTenant$)
    .build() {
}

import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { GetDistributionTenantByDomain$ } from "../schemas/schemas_0";
export { $Command };
export class GetDistributionTenantByDomainCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "GetDistributionTenantByDomain", {})
    .n("CloudFrontClient", "GetDistributionTenantByDomainCommand")
    .sc(GetDistributionTenantByDomain$)
    .build() {
}

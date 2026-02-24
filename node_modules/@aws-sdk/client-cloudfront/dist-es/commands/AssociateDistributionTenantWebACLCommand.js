import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { AssociateDistributionTenantWebACL$ } from "../schemas/schemas_0";
export { $Command };
export class AssociateDistributionTenantWebACLCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "AssociateDistributionTenantWebACL", {})
    .n("CloudFrontClient", "AssociateDistributionTenantWebACLCommand")
    .sc(AssociateDistributionTenantWebACL$)
    .build() {
}

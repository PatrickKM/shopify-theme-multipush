import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { ListContinuousDeploymentPolicies$ } from "../schemas/schemas_0";
export { $Command };
export class ListContinuousDeploymentPoliciesCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "ListContinuousDeploymentPolicies", {})
    .n("CloudFrontClient", "ListContinuousDeploymentPoliciesCommand")
    .sc(ListContinuousDeploymentPolicies$)
    .build() {
}

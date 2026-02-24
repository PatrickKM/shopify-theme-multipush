import { getEndpointPlugin } from "@smithy/middleware-endpoint";
import { Command as $Command } from "@smithy/smithy-client";
import { commonParams } from "../endpoint/EndpointParameters";
import { DescribeFunction$ } from "../schemas/schemas_0";
export { $Command };
export class DescribeFunctionCommand extends $Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
})
    .s("Cloudfront2020_05_31", "DescribeFunction", {})
    .n("CloudFrontClient", "DescribeFunctionCommand")
    .sc(DescribeFunction$)
    .build() {
}

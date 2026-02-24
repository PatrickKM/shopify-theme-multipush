import type { Paginator } from "@smithy/types";
import { ListDistributionsByConnectionFunctionCommandInput, ListDistributionsByConnectionFunctionCommandOutput } from "../commands/ListDistributionsByConnectionFunctionCommand";
import { CloudFrontPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListDistributionsByConnectionFunction: (config: CloudFrontPaginationConfiguration, input: ListDistributionsByConnectionFunctionCommandInput, ...rest: any[]) => Paginator<ListDistributionsByConnectionFunctionCommandOutput>;

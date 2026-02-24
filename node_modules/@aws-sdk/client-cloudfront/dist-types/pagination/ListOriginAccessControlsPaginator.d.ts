import type { Paginator } from "@smithy/types";
import { ListOriginAccessControlsCommandInput, ListOriginAccessControlsCommandOutput } from "../commands/ListOriginAccessControlsCommand";
import { CloudFrontPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListOriginAccessControls: (config: CloudFrontPaginationConfiguration, input: ListOriginAccessControlsCommandInput, ...rest: any[]) => Paginator<ListOriginAccessControlsCommandOutput>;

import type { IGQLRequest } from "./types";
export declare const GQLRequest: <D, V extends Record<string, any> = Record<string, any>>(params: IGQLRequest<V>) => Promise<import("graphql-request/build/esm/types").GraphQLClientResponse<D>>;

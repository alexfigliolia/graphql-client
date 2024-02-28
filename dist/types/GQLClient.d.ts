import type { ErrorHandling, IGQLRequest } from "./types";
export declare class GQLClient<D, V extends Record<string, any> = Record<string, any>> {
    url: string;
    query: string;
    variables: V;
    fetchFN: typeof fetch;
    errorHandling: ErrorHandling;
    signal: AbortController;
    constructor({ url, query, variables, fetchFN, errorHandling, }: IGQLRequest<V>);
    request(): Promise<import("graphql-request/build/esm/types").GraphQLClientResponse<D>>;
    abort(): void;
}

import { GraphQLClient } from "graphql-request";
export class GQLClient {
    url;
    query;
    variables;
    fetchFN;
    errorHandling;
    signal = new AbortController();
    constructor({ url, query, variables, fetchFN = fetch, errorHandling = "first", }) {
        this.url = url;
        this.query = query;
        this.fetchFN = fetchFN;
        this.variables = variables;
        this.errorHandling = errorHandling;
    }
    async request() {
        const client = new GraphQLClient(this.url, {
            mode: "cors",
            method: "POST",
            errorPolicy: "all",
            fetch: this.fetchFN,
            credentials: "include",
            signal: this.signal.signal,
        });
        try {
            const response = await client.rawRequest(this.query, this.variables);
            if (response.errors?.length) {
                throw response;
            }
            return response;
        }
        catch (error) {
            if (this.errorHandling === "first" && error?.response?.errors?.length) {
                throw new Error(error.response.errors[0].message);
            }
            throw error;
        }
    }
    abort() {
        this.signal.abort();
        this.signal = new AbortController();
    }
}

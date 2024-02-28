import { GQLClient } from "./GQLClient.js";
export const GQLRequest = (params) => {
    const client = new GQLClient(params);
    return client.request();
};

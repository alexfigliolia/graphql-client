"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLRequest = void 0;
const GQLClient_1 = require("./GQLClient");
const GQLRequest = (params) => {
    const client = new GQLClient_1.GQLClient(params);
    return client.request();
};
exports.GQLRequest = GQLRequest;

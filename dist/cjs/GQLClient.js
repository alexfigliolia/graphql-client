"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLClient = void 0;
const graphql_request_1 = require("graphql-request");
class GQLClient {
    constructor({ url, query, variables, fetchFN = fetch, errorHandling = "first", }) {
        this.signal = new AbortController();
        this.url = url;
        this.query = query;
        this.fetchFN = fetchFN;
        this.variables = variables;
        this.errorHandling = errorHandling;
    }
    request() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const client = new graphql_request_1.GraphQLClient(this.url, {
                mode: "cors",
                method: "POST",
                errorPolicy: "all",
                fetch: this.fetchFN,
                credentials: "include",
                signal: this.signal.signal,
            });
            try {
                const response = yield client.rawRequest(this.query, this.variables);
                if ((_a = response.errors) === null || _a === void 0 ? void 0 : _a.length) {
                    throw response;
                }
                return response;
            }
            catch (error) {
                if (this.errorHandling === "first" && ((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.errors) === null || _c === void 0 ? void 0 : _c.length)) {
                    throw new Error(error.response.errors[0].message);
                }
                throw error;
            }
        });
    }
    abort() {
        this.signal.abort();
        this.signal = new AbortController();
    }
}
exports.GQLClient = GQLClient;

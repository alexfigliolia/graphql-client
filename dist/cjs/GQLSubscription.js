"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLSubscription = void 0;
const graphql_sse_1 = require("graphql-sse");
const event_emitter_1 = require("@figliolia/event-emitter");
class GQLSubscription {
    constructor(options) {
        this.listeners = [];
        this.Emitter = new event_emitter_1.EventEmitter();
        this.url = options.url;
        this.query = options.query;
        this.variables = options.variables;
    }
    open() {
        if (!this.Client) {
            this.Client = (0, graphql_sse_1.createClient)({
                url: this.url,
                credentials: "include",
            });
        }
        this.internalUnsusbscribe = this.Client.subscribe({
            query: this.query,
            variables: this.variables,
        }, {
            next: data => {
                this.Emitter.emit("on-data", data);
            },
            error: error => {
                this.Emitter.emit("on-error", new Error("GQL this Error", { cause: error }));
            },
            complete: () => { },
        });
    }
    onData(callback) {
        this.listeners.push({
            event: "on-data",
            ID: this.Emitter.on("on-data", callback),
        });
    }
    onError(callback) {
        this.listeners.push({
            event: "on-error",
            ID: this.Emitter.on("on-error", callback),
        });
    }
    close() {
        if (this.internalUnsusbscribe) {
            this.internalUnsusbscribe();
            this.internalUnsusbscribe = undefined;
        }
        this.unsubscribe();
    }
    closeAll() {
        if (!this.Client) {
            return;
        }
        this.close();
        this.Client.dispose();
        this.Client = undefined;
    }
    unsubscribe() {
        while (this.listeners.length) {
            const listener = this.listeners.pop();
            if (listener) {
                this.Emitter.off(listener.event, listener.ID);
            }
        }
    }
}
exports.GQLSubscription = GQLSubscription;

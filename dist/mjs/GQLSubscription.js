import { createClient } from "graphql-sse";
import { EventEmitter } from "@figliolia/event-emitter";
export class GQLSubscription {
    url;
    variables;
    query;
    Client;
    internalUnsusbscribe;
    listeners = [];
    Emitter = new EventEmitter();
    constructor(options) {
        this.url = options.url;
        this.query = options.query;
        this.variables = options.variables;
    }
    open() {
        if (!this.Client) {
            this.Client = createClient({
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

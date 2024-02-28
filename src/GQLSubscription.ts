import type { Client, ExecutionResult } from "graphql-sse";
import { createClient } from "graphql-sse";
import { EventEmitter } from "@figliolia/event-emitter";
import type { IGQLSubscription, Listener, Stream } from "./types";

export class GQLSubscription<
  D,
  V extends Record<string, any> = Record<string, any>,
> {
  url: string;
  variables: V;
  query: string;
  private Client?: Client<false>;
  internalUnsusbscribe?: () => void;
  private listeners: Listener[] = [];
  private Emitter = new EventEmitter<Stream<ExecutionResult<D, V>>>();
  constructor(options: IGQLSubscription<V>) {
    this.url = options.url;
    this.query = options.query;
    this.variables = options.variables;
  }

  public open() {
    if (!this.Client) {
      this.Client = createClient({
        url: this.url,
        credentials: "include",
      });
    }
    this.internalUnsusbscribe = this.Client.subscribe<D, V>(
      {
        query: this.query,
        variables: this.variables,
      },
      {
        next: data => {
          this.Emitter.emit("on-data", data);
        },
        error: error => {
          this.Emitter.emit(
            "on-error",
            new Error("GQL this Error", { cause: error }),
          );
        },
        complete: () => {},
      },
    );
  }

  public onData(callback: (data: ExecutionResult<D, V>) => void) {
    this.listeners.push({
      event: "on-data",
      ID: this.Emitter.on("on-data", callback),
    });
  }

  public onError(callback: (error: Error) => void) {
    this.listeners.push({
      event: "on-error",
      ID: this.Emitter.on("on-error", callback),
    });
  }

  public close() {
    if (this.internalUnsusbscribe) {
      this.internalUnsusbscribe();
      this.internalUnsusbscribe = undefined;
    }
    this.unsubscribe();
  }

  public closeAll() {
    if (!this.Client) {
      return;
    }
    this.close();
    this.Client.dispose();
    this.Client = undefined;
  }

  private unsubscribe() {
    while (this.listeners.length) {
      const listener = this.listeners.pop();
      if (listener) {
        this.Emitter.off(listener.event, listener.ID);
      }
    }
  }
}

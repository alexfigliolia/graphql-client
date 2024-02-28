import type { ExecutionResult } from "graphql-sse";
import type { IGQLSubscription } from "./types";
export declare class GQLSubscription<D, V extends Record<string, any> = Record<string, any>> {
    url: string;
    variables: V;
    query: string;
    private Client?;
    internalUnsusbscribe?: () => void;
    private listeners;
    private Emitter;
    constructor(options: IGQLSubscription<V>);
    open(): void;
    onData(callback: (data: ExecutionResult<D, V>) => void): void;
    onError(callback: (error: Error) => void): void;
    close(): void;
    closeAll(): void;
    private unsubscribe;
}

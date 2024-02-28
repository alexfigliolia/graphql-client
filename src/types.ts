export type ErrorHandling = "all" | "first";

export interface IGQLRequest<V extends Record<string, any>> {
  url: string;
  query: string;
  variables: V;
  fetchFN?: typeof fetch;
  errorHandling?: ErrorHandling;
}

export interface ErrorLocation {
  message: string;
  location: { column: number; line: number }[];
}

export interface Stream<T> {
  "on-data": T;
  "on-error": Error;
}

export interface IGQLSubscription<V extends Record<string, any>> {
  url: string;
  query: string;
  variables: V;
}

export interface Listener {
  ID: string;
  event: Extract<keyof Stream<any>, string>;
}

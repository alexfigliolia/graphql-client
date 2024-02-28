# GQL Client
A small type-safe client for making GraphQL requests over HTTP and server-sent events

## Installation
```bash
npm i @alexfigliolia/graphql-client
# or
yarn add @alexfigliolia/graphql-client
```

## Usage Over HTTP
### Fire and Forget Requests
```typescript
import { GQLRequest } from "@figliolia/graphql-client";

const fetchData = () => {
  return GQLRequest<QueryOrMutation, Variables>({
    url: "/graphql",
    query: "query-document",
    variables: {}
    fetchFN: fetch, /* optional fetch function */,
    errorHandling: "first", /* first | all */
    // this option optionally throws only the first error 
    // in the graphql errors array if you get tired of 
    // traversing the array for only the first item 
  });
}
```

### Requests that can be aborted or refired
```typescript
import { GQLClient } from "@figliolia/graphql-client";

const client = GQLClient<QueryOrMutation, Variables>({
  url: "/graphql",
  query: "query-document",
  variables: {}
});

// Send the request
client.request();
// Optionally abort the request
client.abort()
// Optionally send the request again
client.abort()
```

### Usage with Server Sent Events
```typescript
import { GQLSubscription } from "@figliolia/graphql-client";

const subscription = GQLSubscription<Subscription, Variables>({
  url: "/graphql",
  query: "subscription-document",
  variables: {}
});

// subscribe to incoming data
subscription.onData(data => {});

// subscribe to incoming errors
subscription.onData(error => {});

// unsubscribe 
subscription.close();

// unsubscribe and close the SSE connection 
subscription.closeAll();
```
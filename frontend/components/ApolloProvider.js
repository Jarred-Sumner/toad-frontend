import localForage from "localforage";
import fetchPonyfill from "fetch-ponyfill";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloClient } from "apollo-client";
import { concat, split } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { CachePersistor } from "apollo-cache-persist";
import Alert from "./Alert";
import { ApolloProvider as RAApolloProvider } from "react-apollo";
import { defaultProps } from "recompose";
import { DEFAULT_DEPRECATION_REASON } from "graphql";
import { withData } from "next-apollo";
import cookies from "next-cookies";
import {
  isProduction,
  baseHostname,
  BASE_HOSTNAME,
  BASE_DOMAIN,
  WEBSOCKET_HOSTNAME
} from "config";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import introspectionQueryResultData from "Toads/fragmentTypes.json";
import _ from "lodash";
import { HttpLink } from "apollo-link-http";

let cookieJar;

let defaultFetchHeaders = {};
const { fetch } = fetchPonyfill();

export const isInitialLoading = networkStatus => networkStatus === 1;
export const isActivelyRefetching = networkStatus => networkStatus === 4;
export const isPassivelyRefetching = networkStatus =>
  networkStatus === 2 || networkStatus === 6;
export const isFetchingMore = networkStatus => networkStatus === 3;
export const isReady = networkStatus => networkStatus === 7;
// Error States
export const isError = networkStatus => networkStatus === 8;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const createCache = () => {
  const cache = new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: o => {
      if (o.id) {
        return `${o.__typename}-${o.id}`;
      } else {
        return null;
      }
    }
    // cacheRedirects: {
    //   Post: {
    //     author: (_, args) => {
    //       console.log("GET PROFILE AUTHOR", args);
    //       return toIdValue(
    //         dataIdFromObject({ __typename: "Profile", id: args["id"] })
    //       );
    //     }
    //   },
    //   Query: {
    //     ViewMenu: (_, args) => {
    //       return toIdValue(
    //         cache.config.dataIdFromObject({
    //           __typename: "RestaurantsMenu",
    //           id: args.id
    //         })
    //       );
    //     },
    //     Member: (_, args) => {
    //       return toIdValue(
    //         cache.config.dataIdFromObject({
    //           __typename: "Member",
    //           id: args.id
    //         })
    //       );
    //     },
    //     Profile: (_, args) =>
    //       toIdValue(
    //         cache.config.dataIdFromObject({
    //           __typename: "Profile",
    //           id: args.id
    //         })
    //       ),
    //     Group: (_, args) =>
    //       toIdValue(
    //         cache.config.dataIdFromObject({
    //           __typename: "Group",
    //           id: args.id
    //         })
    //       ),
    //     Post: (_, args) => {
    //       return toIdValue(
    //         cache.config.dataIdFromObject({
    //           __typename: "Post",
    //           id: args.id
    //         })
    //       );
    //     }
    //   }
    // }
  });

  if (typeof window !== "undefined") {
    const persistor = new CachePersistor({
      cache,
      storage: localForage
    });
  }

  return cache;
};

export const createApolloSSRClient = ({ headers }) => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
      const displayMessage = _.first(graphQLErrors).message;
      Alert.error(null, displayMessage);
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const GRAPHQL_URL = `${BASE_HOSTNAME}/graphql`;

  console.log("Initializing Apollo –", GRAPHQL_URL);
  const httpLink = new BatchHttpLink({
    uri: GRAPHQL_URL,
    fetch,
    headers,
    credentials: "include"
  });

  //   console.log("Reset Apollo Cache");
  // });

  return {
    link: httpLink,
    createCache,
    fetchPolicy: "cache-and-network"
  };
};

const createApolloWebClient = () => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
      const displayMessage = _.first(graphQLErrors).message;
      Alert.error(null, displayMessage);
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const GRAPHQL_URL = `${BASE_HOSTNAME}/graphql`;

  console.log("Initializing Apollo –", GRAPHQL_URL);
  const httpLink = new BatchHttpLink({
    uri: GRAPHQL_URL,
    fetch,
    credentials: "include"
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    new WebSocketLink({
      uri: `${WEBSOCKET_HOSTNAME}/graphql`,
      options: {
        reconnect: true
      }
    }),
    httpLink
  );

  // persistor.purge().then(() => {
  //   console.log("Reset Apollo Cache");
  // });

  return {
    link,
    createCache,
    fetchPolicy: "cache-and-network"
  };
};

export const configureApolloClient = (opts = {}) => {
  if (typeof window === "undefined") {
    return createApolloSSRClient({
      headers: _.get(opts, "req.headers")
    });
  } else {
    return createApolloWebClient();
  }
};

export const withApollo = withData(configureApolloClient);
export default withApollo;

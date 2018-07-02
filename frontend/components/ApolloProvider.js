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

let cookieJar;
let wsLink;

const { fetch: rawFetch } = fetchPonyfill();

let fetch;
if (typeof window === "undefined") {
  const toughCookie = require("tough-cookie");
  cookieJar = new toughCookie.CookieJar();

  fetch = require("fetch-cookie")(rawFetch, cookieJar);
} else {
  fetch = rawFetch;

  wsLink = new WebSocketLink({
    uri: `${WEBSOCKET_HOSTNAME}/graphql`,
    options: {
      reconnect: true
    }
  });
}

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

// persistor.purge().then(() => {
//   console.log("Reset Apollo Cache");
// });

export const isInitialLoading = networkStatus => networkStatus === 1;
export const isActivelyRefetching = networkStatus => networkStatus === 4;
export const isPassivelyRefetching = networkStatus =>
  networkStatus === 2 || networkStatus === 6;
export const isFetchingMore = networkStatus => networkStatus === 3;
export const isReady = networkStatus => networkStatus === 7;
// Error States
export const isError = networkStatus => networkStatus === 8;

const fetchSessionCookie = async ctx => {
  const allCookies = cookies(ctx);
  const sessionCookie = allCookies.toads_session;

  if (sessionCookie) {
    return sessionCookie;
  } else {
    const response = await fetch(BASE_HOSTNAME + "/session", {
      method: "POST",
      credentials: "include"
    });

    const json = await response.json();

    if (json.toads_session) {
      return json.toads_session;
    } else {
      return null;
    }
  }
};

const link =
  typeof window !== "undefined"
    ? split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === "OperationDefinition" && operation === "subscription";
        },
        wsLink,
        httpLink
      )
    : httpLink;

export const withApollo = Component => {
  const NewComponent = withData({
    link,
    createCache,
    fetchPolicy: "cache-and-network"
  })(Component);

  const oldInitialProps = NewComponent.getInitialProps;

  NewComponent.getInitialProps = async ctx => {
    if (ctx.req) {
      const sessionCookie = await fetchSessionCookie(ctx);

      if (sessionCookie) {
        cookieJar.setCookieSync(
          `toads_session=${sessionCookie}`,
          BASE_HOSTNAME
        );

        ctx.res.cookie("toads_session", sessionCookie, {
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          httpOnly: true,
          domain: isProduction() ? `.${BASE_DOMAIN}` : undefined,
          secure: isProduction()
        });
      }
    }

    if (oldInitialProps) {
      return oldInitialProps(ctx);
    } else {
      return {};
    }
  };

  return NewComponent;
};

export default withApollo;

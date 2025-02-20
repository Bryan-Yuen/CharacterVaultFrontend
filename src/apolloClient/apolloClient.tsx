import { ApolloClient, InMemoryCache } from "@apollo/client";
import "dotenv/config";

if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
  throw new Error("no server url");
}

if (!process.env.NEXT_PUBLIC_SERVER_URL) {
  throw new Error("no server url");
}

if (!process.env.NEXT_PUBLIC_APP_VERSION) {
  throw new Error("no version env variable");
}

const client = new ApolloClient({
  headers: {
    "client-version": process.env.NEXT_PUBLIC_APP_VERSION,
  },
  uri: process.env.NEXT_PUBLIC_SERVER_URL,
  cache: new InMemoryCache({
    typePolicies: {
      ActorWithTags: {
        keyFields: ["actor_url_slug"],
      },
      ActorTag: {
        keyFields: ["actor_tag_id"],
      },
      UserTagsWithActorTagsReturn: {
        keyFields: ["user_tag_id"],
      },
      ActorWithTagsAndLinks: {
        keyFields: ["actor_url_slug"],
      },
    },
  }),
  credentials: process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL_DEVELOPMENT" ? "include" : "same-origin",
});

export default client;

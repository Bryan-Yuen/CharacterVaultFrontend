import { ApolloClient, InMemoryCache } from "@apollo/client";
import "dotenv/config";

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
      PornstarWithTags: {
        keyFields: ["pornstar_url_slug"],
      },
      PornstarTag: {
        keyFields: ["tag_id"],
      },
      UserTag: {
        keyFields: ["user_tag_id"],
      },
      PornstarWithTagsAndLinks: {
        keyFields: ["pornstar_url_slug"],
      },

      /*
        UserTagWithPornstarTagTest: {
          // In an inventory management system, products might be identified
          // by their UPC.
          keyFields: ["user_tag_id",],
        },
        */
    },
  }),
  credentials: "include",
});

export default client;

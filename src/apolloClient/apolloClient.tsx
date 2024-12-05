import { ApolloClient, InMemoryCache} from "@apollo/client";
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_DEVELOPMENT_URL) {
  throw new Error('no url');
}
if (!process.env.NEXT_PUBLIC_APP_VERSION) {
  throw new Error('no version env variable');
}
console.log("wat is vers",process.env.NEXT_PUBLIC_APP_VERSION)


const client = new ApolloClient({
    //uri: "http://localhost:4000",
    // this allows you to call service on other devices not on the same one
    headers: {
      'client-version': process.env.NEXT_PUBLIC_APP_VERSION
    },
    uri: process.env.NEXT_PUBLIC_PRODUCTION ? process.env.NEXT_PUBLIC_PRODUCTION_URL : process.env.NEXT_PUBLIC_DEVELOPMENT_URL,
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
        PornstarWithTagsAndLinks : {
          keyFields: ["pornstar_url_slug"],
        }

       /*
        UserTagWithPornstarTagTest: {
          // In an inventory management system, products might be identified
          // by their UPC.
          keyFields: ["user_tag_id",],
        },
        */
      },
    }),
    credentials: 'include',
});

export default client;
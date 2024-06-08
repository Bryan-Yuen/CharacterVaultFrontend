import { ApolloClient, InMemoryCache } from "@apollo/client";
import 'dotenv/config';

const client = new ApolloClient({
    //uri: "http://localhost:4000",
    // this allows you to call service on other devices not on the same one
    uri: process.env.PRODUCTION ? "https://myfapsheettestingwebsite.us/api" : "http://192.168.0.208:4000",
    cache: new InMemoryCache({
      typePolicies: {
        PornstarWithTags: {
          // In an inventory management system, products might be identified
          // by their UPC.
          keyFields: ["pornstar_id"], 
        },
        PornstarTag: {
          // In an inventory management system, products might be identified
          // by their UPC.
          keyFields: ["tag_id"],
        },

        UserTag: {
          // In an inventory management system, products might be identified
          // by their UPC.
          keyFields: ["user_tag_id"],
        },
        PornstarWithTagsAndLinks : {
          keyFields: ["pornstar_id"],
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
import { gql } from "@apollo/client";

const GET_USER_TAGS = gql`
  query GetUserTags {
    getUserTags {
      user_tag_id
      user_tag_text
      pornstar_tags {
        pornstar_tag_id
        pornstar_tag_text
      }
    }
  }
`;

export { GET_USER_TAGS };

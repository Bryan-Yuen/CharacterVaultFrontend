import { gql } from "@apollo/client";

const GET_USER_TAGS = gql`
  query GetUserTags {
    getUserTags {
      user_tag_id
      user_tag_text
      actor_tags {
        actor_tag_id
        actor_tag_text
      }
    }
  }
`;

export { GET_USER_TAGS };

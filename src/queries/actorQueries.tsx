import { gql} from '@apollo/client';

const GET_ACTOR = gql`
query GetActor($getActorInput: GetActorInputType!) {
  getActor(getActorInput: $getActorInput) {
    actor_url_slug
    actor_name
    actor_picture_path
    actor_tags {
      actor_tag_text
      actor_tag_id
    }
    actor_links {
      actor_link_title
      actor_link_url
      actor_link_id
    }
  }
}
`;

/*user_tag id is not necessary here its just the dashboard page*/
/*tag_id think its for apollo cache*/
const GET_ALL_ACTORS_AND_TAGS = gql`
query GetAllActorsAndTags {
  getAllActorsAndTags {
    actor_url_slug
    actor_name
    actor_picture_path
    actor_tags_text
  }
}
`;

export {GET_ACTOR, GET_ALL_ACTORS_AND_TAGS};
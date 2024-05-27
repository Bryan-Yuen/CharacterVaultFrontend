import { gql} from '@apollo/client';

const GET_ALL_PORNSTARS = gql`
query GetAllPornstars {
  getAllPornstars {
    pornstar_id
    pornstar_name
    pornstar_picture_path
  }
}
`;

const GET_PORNSTAR = gql`
query GetPornstar($getPornstarInput: GetPornstarInput!) {
  getPornstar(getPornstarInput: $getPornstarInput) {
    pornstar_id
    pornstar_name
    pornstar_picture_path
    pornstar_tags {
      tag_text
      tag_id
      user_tag {
        user_tag_id
      }
    }
    pornstar_links {
      pornstar_link_title
      pornstar_link_url
      pornstar_link_id
    }
  }
}
`;

/*
const GET_ALL_PORNSTAR_TAGS = gql`
query GetAllPornstarTags {
  getAllPornstarTags {
    tag_id
    tag_text
    user_tag {
      user_tag_id
    }
  }
}
`;
*/

/*user_tag id is not necessary here its just the dashboard page*/
/*tag_id think its for apollo cache*/
const GET_ALL_PORNSTARS_AND_TAGS = gql`
query GetAllPornstarsAndTags {
  getAllPornstarsAndTags {
    pornstar_id
    pornstar_name
    pornstar_picture_path
    pornstar_tags_text
  }
}
`;

export {GET_ALL_PORNSTARS, GET_PORNSTAR, GET_ALL_PORNSTARS_AND_TAGS};
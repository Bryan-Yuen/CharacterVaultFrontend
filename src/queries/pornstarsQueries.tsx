import { gql} from '@apollo/client';

const GET_PORNSTAR = gql`
query GetPornstar($getPornstarInput: GetPornstarInputType!) {
  getPornstar(getPornstarInput: $getPornstarInput) {
    pornstar_url_slug
    pornstar_name
    pornstar_picture_path
    pornstar_tags {
      pornstar_tag_text
      pornstar_tag_id
    }
    pornstar_links {
      pornstar_link_title
      pornstar_link_url
      pornstar_link_id
    }
  }
}
`;

/*user_tag id is not necessary here its just the dashboard page*/
/*tag_id think its for apollo cache*/
const GET_ALL_PORNSTARS_AND_TAGS = gql`
query GetAllPornstarsAndTags {
  getAllPornstarsAndTags {
    pornstar_url_slug
    pornstar_name
    pornstar_picture_path
    pornstar_tags_text
  }
}
`;

export {GET_PORNSTAR, GET_ALL_PORNSTARS_AND_TAGS};
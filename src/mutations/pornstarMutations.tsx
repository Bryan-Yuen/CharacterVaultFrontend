import { gql } from "@apollo/client";

const ADD_PORNSTAR = gql`
  mutation Mutation($newPornstarInput: NewPornstarInput!) {
    addPornstar(newPornstarInput: $newPornstarInput) {
      s3Url
      pornstar_id
    }
  }
`;
/*
const EDIT_PORNSTAR = gql`
  mutation Mutation($editPornstarInput: EditPornstarInput!) {
    editPornstar(editPornstarInput: $editPornstarInput) {
      s3Url
      pornstar_id
      pornstar_picture_path
      pornstar {
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
  }
`;
*/
const EDIT_PORNSTAR = gql`
  mutation Mutation($editPornstarInput: EditPornstarInput!) {
    editPornstar(editPornstarInput: $editPornstarInput) {
      s3Url
      pornstar_id
      pornstar_picture_path
    }
  }
`;


const DELETE_PORNSTAR = gql`
  mutation Mutation($deletePornstarInput: DeletePornstarInput!) {
    deletePornstar(deletePornstarInput: $deletePornstarInput)
  }
`;

export { ADD_PORNSTAR, EDIT_PORNSTAR, DELETE_PORNSTAR };

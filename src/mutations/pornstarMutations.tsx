import { gql } from "@apollo/client";

const ADD_PORNSTAR = gql`
  mutation Mutation($newPornstarInput: NewPornstarInput!) {
    addPornstar(newPornstarInput: $newPornstarInput) {
      s3Url
      pornstar_id
    }
  }
`;

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

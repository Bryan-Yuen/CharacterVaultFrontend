import { gql } from "@apollo/client";

const ADD_PORNSTAR = gql`
  mutation Mutation($addPornstarInput: AddPornstarInputType!) {
    addPornstar(addPornstarInput: $addPornstarInput) {
      s3Url
      pornstar_url_slug
    }
  }
`;

const EDIT_PORNSTAR = gql`
  mutation Mutation($editPornstarInput: EditPornstarInputType!) {
    editPornstar(editPornstarInput: $editPornstarInput) {
      s3Url
      pornstar_picture_path
    }
  }
`;

const DELETE_PORNSTAR = gql`
  mutation Mutation($deletePornstarInput: DeletePornstarInputType!) {
    deletePornstar(deletePornstarInput: $deletePornstarInput)
  }
`;

export { ADD_PORNSTAR, EDIT_PORNSTAR, DELETE_PORNSTAR };

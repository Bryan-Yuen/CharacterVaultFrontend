import { gql } from "@apollo/client";

const ADD_PORNSTAR = gql`
  mutation Mutation($addPornstarInput: AddPornstarInputType!) {
    addPornstar(addPornstarInput: $addPornstarInput) {
      secured_data
      pornstar_url_slug
      pornstar_picture_path
    }
  }
`;

const EDIT_PORNSTAR = gql`
  mutation Mutation($editPornstarInput: EditPornstarInputType!) {
    editPornstar(editPornstarInput: $editPornstarInput) {
      secured_data
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

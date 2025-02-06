import { gql } from "@apollo/client";

const ADD_ACTOR = gql`
  mutation Mutation($addActorInput: AddActorInputType!) {
    addActor(addActorInput: $addActorInput) {
      secured_data
      actor_url_slug
      actor_picture_path
    }
  }
`;

const EDIT_ACTOR = gql`
  mutation Mutation($editActorInput: EditActorInputType!) {
    editActor(editActorInput: $editActorInput) {
      secured_data
      actor_picture_path
    }
  }
`;

const DELETE_ACTOR = gql`
  mutation Mutation($deleteActorInput: DeleteActorInputType!) {
    deleteActor(deleteActorInput: $deleteActorInput)
  }
`;

export { ADD_ACTOR, EDIT_ACTOR, DELETE_ACTOR };

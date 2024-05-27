import { gql} from '@apollo/client';

const ADD_USER_TAG = gql`
mutation Mutation($newUserTag: UserTagInput!) {
  addUserTag(newUserTag: $newUserTag) {
    user_tag_id
  }
}
`;

const DELETE_USER_TAG = gql`
mutation Mutation($userTagId: DeleteUserTagInput!) {
  deleteUserTag(userTagId: $userTagId)
}
`;

const EDIT_USER_TAG = gql`
mutation Mutation($editUserTagInput: EditUserTagInput!) {
  editUserTag(editUserTagInput: $editUserTagInput)
}
`;


export {ADD_USER_TAG,DELETE_USER_TAG,EDIT_USER_TAG};
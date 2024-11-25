import { gql} from '@apollo/client';

// get user tag id if you want to use cache or return usertag
const ADD_USER_TAG = gql`
mutation Mutation($newUserTag: AddUserTagInputType!) {
  addUserTag(newUserTag: $newUserTag)
}
`;

const DELETE_USER_TAG = gql`
mutation Mutation($userTagId: DeleteUserTagInputType!) {
  deleteUserTag(userTagId: $userTagId)
}
`;

const EDIT_USER_TAG = gql`
mutation Mutation($editUserTagInput: EditUserTagInputType!) {
  editUserTag(editUserTagInput: $editUserTagInput)
}
`;


export {ADD_USER_TAG,DELETE_USER_TAG,EDIT_USER_TAG};
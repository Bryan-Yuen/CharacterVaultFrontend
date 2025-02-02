import { gql} from '@apollo/client';

const GET_USER_PROFILE = gql`
query Query {
    getUserProfile {
      user_email
      user_username
      user_is_interested
      user_is_premium
    }
  }
`;

const CHECK_USER_LOGGED_IN = gql`
query Query {
  checkIfLoggedin
}
`;

export {GET_USER_PROFILE, CHECK_USER_LOGGED_IN};
import { gql} from '@apollo/client';

const GET_USER_PROFILE = gql`
query Query {
    getUserProfile {
      user_email
      user_username
    }
  }
`;

const CHECK_USER_PREMIUM = gql`
query Query {
  checkUserPremium
}
`;

const CHECK_USER_LOGGED_IN = gql`
query Query {
  checkIfLoggedin
}
`;

export {GET_USER_PROFILE, CHECK_USER_PREMIUM, CHECK_USER_LOGGED_IN};
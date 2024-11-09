import { gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation RegisterUser($user: RegisterUserInput!) {
    registerUser(registerUserData: $user) {
      message
      success
    }
  }
`;

const LOGIN_USER = gql`
  mutation LoginUser($user: LoginUserInput!) {
    loginUser(loginUserData: $user) {
      message
      success
    }
  }
`;

const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser
  }
`;

const FORGOT_PASSWORD = gql`
  mutation Mutation($email: String!) {
    forgotPassword(email: $email)
  }
`;

const CHANGE_PASSWORD = gql`
  mutation Mutation($newPassword: String!, $token: String!) {
    changePassword(newPassword: $newPassword, token: $token)
  }
`;

const CHANGE_PASSWORD_LOGGED_IN = gql`
  mutation Mutation($newPassword: String!, $currentPassword: String!) {
    changePasswordLoggedIn(
      newPassword: $newPassword
      currentPassword: $currentPassword
    ) {
      user_email
      user_password
      user_username
    }
  }
`;

const CHANGE_EMAIL = gql`
  mutation Mutation($newEmail: String!) {
    changeEmail(newEmail: $newEmail)
  }
`;

const CONFIRM_CHANGE_EMAIL = gql`
  mutation Mutation($token: String!) {
    confirmChangeEmail(token: $token) {
      user_email
      user_id
      user_password
    }
  }
`;

export {
  REGISTER_USER,
  LOGIN_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_LOGGED_IN,
  CHANGE_EMAIL,
  CONFIRM_CHANGE_EMAIL,
};

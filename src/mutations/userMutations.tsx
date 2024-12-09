import { gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation RegisterUser($user: RegisterUserInputType!) {
    registerUser(registerUserData: $user)
  }
`;

const LOGIN_USER = gql`
  mutation LoginUser($user: LoginUserInputType!) {
    loginUser(loginUserData: $user)
  }
`;

const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser
  }
`;

const FORGOT_PASSWORD = gql`
  mutation Mutation($forgotPasswordInput: ForgotPasswordInputType!) {
    forgotPassword(forgotPasswordInput: $forgotPasswordInput)
  }
`;

const CHANGE_PASSWORD = gql`
  mutation Mutation($changePasswordInput: ChangePasswordInputType!) {
    changePassword(changePasswordInput: $changePasswordInput)
  }
`;

const CHANGE_PASSWORD_LOGGED_IN = gql`
  mutation Mutation(
    $changePasswordLoggedInInput: ChangePasswordLoggedInInputType!
  ) {
    changePasswordLoggedIn(
      changePasswordLoggedInInput: $changePasswordLoggedInInput
    )
  }
`;

const CHANGE_EMAIL = gql`
  mutation Mutation($changeEmailInput: ChangeEmailInputType!) {
    changeEmail(changeEmailInput: $changeEmailInput)
  }
`;

const CONFIRM_CHANGE_EMAIL = gql`
  mutation Mutation($confirmChangeEmailInput: ConfirmChangeEmailInputType!) {
    confirmChangeEmail(confirmChangeEmailInput: $confirmChangeEmailInput) 
  }
`;

const CONFIRM_EMAIL_ADDRESS = gql`
  mutation Mutation($confirmEmailAddressInput: ConfirmEmailAddressInputType!) {
    confirmEmailAddress(confirmEmailAddressInput: $confirmEmailAddressInput) 
  }
`;

const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail
  }
`;

const UPDATE_USER_IS_INTERESTED = gql`
mutation Mutation($updateUserIsInterestedInput: UpdateUserIsInterestedInputType!) {
  updateUserIsInterested(updateUserIsInterestedInput: $updateUserIsInterestedInput)
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
  CONFIRM_EMAIL_ADDRESS,
  RESEND_VERIFICATION_EMAIL,
  UPDATE_USER_IS_INTERESTED
};

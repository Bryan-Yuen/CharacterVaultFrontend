import { gql} from '@apollo/client';

const SEND_PAYMENT = gql`
mutation Mutation($payment: PaymentInput!) {
    payment(payment: $payment)
  }
`;

const UPDATE_PAYMENT = gql`
mutation Mutation($payment: PaymentInput!) {
  UpdateCreditCard(payment: $payment)
}
`;

const CANCEL_SUBSCRIPTION = gql`
mutation CancelSubscription {
  cancelSubscription
}
`;

const KEEP_SUBSCRIPTION = gql`
mutation KeepSubscription {
  KeepSubscription
}
`;



export {SEND_PAYMENT, UPDATE_PAYMENT, CANCEL_SUBSCRIPTION, KEEP_SUBSCRIPTION};
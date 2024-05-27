import { gql} from '@apollo/client';

const CHECK_SUBSCRIPTION = gql`
query CheckSubscription {
    checkSubscription {
      subscription_end_date
      subscription_next_billing_date
      subscription_status
      number_of_pornstars
      user_last_four_credit_card_number
    }
  }
`;

export {CHECK_SUBSCRIPTION};
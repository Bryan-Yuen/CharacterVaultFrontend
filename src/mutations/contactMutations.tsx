import { gql} from '@apollo/client';

const CONTACT_FORM = gql`
mutation Mutation($contactFormInput: ContactEmailInputType!) {
  contactForm(contactFormInput: $contactFormInput)
}
`;

const SUPPORT_FORM = gql`
mutation Mutation($supportFormInput: SupportEmailInputType!) {
  supportForm(supportFormInput: $supportFormInput)
}
`;

const FEEDBACK_FORM = gql`
mutation Mutation($feedbackFormInput: FeedbackEmailInputType!) {
  feedbackForm(feedbackFormInput: $feedbackFormInput)
}
`;


export {CONTACT_FORM, SUPPORT_FORM, FEEDBACK_FORM};
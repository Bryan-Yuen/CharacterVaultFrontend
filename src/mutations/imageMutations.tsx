import { gql} from '@apollo/client';

const GET_URL = gql`
query Query {
  getUrl
}

`;

export {GET_URL};
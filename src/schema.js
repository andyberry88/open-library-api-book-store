import { gql } from 'apollo-server';

export default gql`

    type Publisher {
        name: String
    }

    type Author {
        name: String
        url: String
    }

    type Book {
        ID: String
        title: String
        url: String
        numberOfPages: Int
        coverUrl: String
        publishers: [Publisher]
        authors: [Author]
        publishDate: String
    }

  type Query {
      books(search: String): [Book]
  }
`;

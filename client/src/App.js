import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import Book from './Book';

const apolloClient = new ApolloClient({ uri: '//localhost:4000' });

const getBooksQuery = gql`
  query GetBooks($searchValue: String) {
    books(search: $searchValue) {
      ID
      title
      url
      numberOfPages
      coverUrl
      authors {
          name
          url
      }
      publishers {
          name
      }
      publishDate
    }
  }
`;

const PageWrapper = styled.div`
    margin: 20px
`;

const SearchBarWrapper = styled.div`
    margin: 0 0 20px 0;
    width: 100%;
    h1 {
        margin: 0 0 5px 0;
    }
    input {
        width: 100%;
        padding: 4px 2px;
    }
    & > div {
        color: #bbb;
        fontSize: 0.9rem;
        padding: 5px 0;
    }
`;

const ResultsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

function App() {
    const [ searchValue, setSearchValue ] = useState('');
    return (
        <ApolloProvider client={apolloClient}>
            <PageWrapper>
                <SearchBarWrapper>
                    <h1>Search</h1>
                    <input onChange={(e) => setSearchValue(e.target.value)} />
                    <div>
                        Searching for {searchValue}
                    </div>
                </SearchBarWrapper>
                <ResultsWrapper>
                    <Query query={getBooksQuery} variables={{ searchValue }}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <div>Loading...</div>;
                            }
                            if (error) {
                                return <div>Error :-(</div>;
                            }
                            if (data.books.length === 0) {
                                return <div>Nothing found :-(</div>;
                            }
                            return data.books.map((book) => <Book key={book.ID} {...book} />);
                        }}
                    </Query>
                </ResultsWrapper>
            </PageWrapper>
        </ApolloProvider>
    );
}

export default App;

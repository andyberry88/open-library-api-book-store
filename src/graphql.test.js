/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import axios from 'axios';

import typeDefs from './schema';
import resolvers from './resolvers';

import booksQueryResult from './open-library-response.json';

chai.use(sinonChai);

const graphqlQuery = (query) => graphql(
    makeExecutableSchema({
        typeDefs,
        resolvers,
    }),
    query,
);

describe('GrahpQL API', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(axios, 'get');
    });

    afterEach(() => {
        sandbox.restore();
    });

    context('books resolver', () => {
        it('doesnt throw an error when querying all fields', async () => {
            axios.get.resolves({
                data: booksQueryResult,
            });
            const graphqlResult = await graphqlQuery(`query {
                books {
                    title
                }
            }`);
            expect(graphqlResult).not.to.contain.keys('errors');
        });

        it('can query all fields for a book', async () => {
            axios.get.resolves({
                data: booksQueryResult,
            });
            const graphqlResult = await graphqlQuery(`query {
                books {
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
            }`);
            const { data: { books } } = graphqlResult;
            expect(books[0]).to.deep.equal({
                ID: 'OLID:OL24347578M',
                title: 'The adventures of Oliver Twist',
                url: 'https://openlibrary.org/books/OL24347578M/The_adventures_of_Oliver_Twist',
                numberOfPages: 509,
                coverUrl: 'https://covers.openlibrary.org/b/id/7883999-M.jpg',
                authors: [
                    {
                        name: 'Charles Dickens',
                        url: 'https://openlibrary.org/authors/OL24638A/Charles_Dickens',
                    },
                ],
                publishers: [
                    {
                        name: 'Scribner',
                    },
                ],
                publishDate: '1898',
            });
        });
    });
});

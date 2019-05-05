/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import sinon from 'sinon';
import axios from 'axios';

import typeDefs from '../schema';
import resolvers from '../resolvers';

import booksResolver from './books-resolver';
import booksQueryResult from '../open-library-response.json';

chai.use(sinonChai);

const graphqlQuery = (query) => graphql(
    makeExecutableSchema({
        typeDefs,
        resolvers,
    }),
    query,
);

describe('books resolver', () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(axios, 'get');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('returns a function', () => {
        expect(booksResolver).to.be.a('function');
    });

    it('queries the open library API to get books', () => {
        booksResolver();
        expect(axios.get).to.have.been.calledOnce;
    });

    it('returns a promise when called', () => {
        expect(booksResolver()).to.be.a('Promise');
    });

    it('returns an empty array if there is no data', async () => {
        axios.get.resolves({});
        const books = await booksResolver();
        expect(books).to.deep.equal([]);
    });

    context('using GraphQL queries', () => {
        it('returns an array of books from the open library API', async () => {
            axios.get.resolves({
                data: {
                    id1: {
                        title: 'foo',
                    },
                    id2: {
                        title: 'bar',
                    },
                },
            });
            const books = await graphqlQuery('query { books { ID title } }');
            expect(books.data.books).to.deep.equal([
                {
                    ID: 'id1',
                    title: 'foo',
                },
                {
                    ID: 'id2',
                    title: 'bar',
                },
            ]);
        });

        it('returns an array of book objects', async () => {
            axios.get.resolves({
                data: {
                    'OLID:OL24347578M': booksQueryResult['OLID:OL24347578M'],
                    'OLID:OL24180216M': booksQueryResult['OLID:OL24180216M'],
                },
            });
            const books = await graphqlQuery('query { books { ID title } }');
            expect(books.data.books).to.deep.equal([
                {
                    ID: 'OLID:OL24347578M',
                    title: 'The adventures of Oliver Twist',
                },
                {
                    ID: 'OLID:OL24180216M',
                    title: 'The Odyssey of Homer',
                },
            ]);
        });

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

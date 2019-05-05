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
        expect(axios.get).to.have.been.calledWithExactly('https://openlibrary.org/api/books?bibkeys=OLID:OL22895148M,OLID:OL6990157M,OLID:OL7101974M,OLID:OL6732939M,OLID:OL7193048M,OLID:OL24347578M,OLID:OL24180216M,OLID:OL24948637M,OLID:OL1631378M,OLID:OL979600M,OLID:OL33674M,OLID:OL7950349M,OLID:OL349749M,OLID:OL30460M,OLID:OL24347578M&jscmd=data&format=json');
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
            const graphqlResult = await graphqlQuery('query { books { ID title } }');
            expect(graphqlResult.data.books).to.deep.equal([
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
            const graphqlResult = await graphqlQuery('query { books { ID title } }');
            expect(graphqlResult.data.books).to.deep.equal([
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
            const graphqlResult = await graphqlQuery('query { books { title } }');
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

        context('providing search argument', () => {
            it('can search by OLID', async () => {
                axios.get.withArgs('https://openlibrary.org/api/books?bibkeys=OLID:OL24347578M&jscmd=data&format=json').resolves({
                    data: { 'OLID:OL24347578M': booksQueryResult['OLID:OL24347578M'] },
                });
                const graphqlResult = await graphqlQuery('query { books(search: "OLID:OL24347578M") { ID title } }');
                expect(graphqlResult.data.books.length).to.equal(1);
                expect(graphqlResult.data.books[0].ID).to.equal('OLID:OL24347578M');
                expect(graphqlResult.data.books[0].title).to.equal('The adventures of Oliver Twist');
                expect(axios.get).to.have.been.calledWithExactly('https://openlibrary.org/api/books?bibkeys=OLID:OL24347578M&jscmd=data&format=json');
            });

            it('can search by title', async () => {
                axios.get.withArgs('https://openlibrary.org/api/books?bibkeys=OLID:OL22895148M,OLID:OL6990157M,OLID:OL7101974M,OLID:OL6732939M,OLID:OL7193048M,OLID:OL24347578M,OLID:OL24180216M,OLID:OL24948637M,OLID:OL1631378M,OLID:OL979600M,OLID:OL33674M,OLID:OL7950349M,OLID:OL349749M,OLID:OL30460M,OLID:OL24347578M&jscmd=data&format=json').resolves({
                    data: booksQueryResult,
                });
                const graphqlResult = await graphqlQuery('query { books(search: "The Odyssey of Homer") { ID title } }');
                expect(graphqlResult.data.books.length).to.equal(1);
                expect(graphqlResult.data.books[0].ID).to.equal('OLID:OL24180216M');
                expect(graphqlResult.data.books[0].title).to.equal('The Odyssey of Homer');
                expect(axios.get).to.have.been.calledWithExactly('https://openlibrary.org/api/books?bibkeys=OLID:OL22895148M,OLID:OL6990157M,OLID:OL7101974M,OLID:OL6732939M,OLID:OL7193048M,OLID:OL24347578M,OLID:OL24180216M,OLID:OL24948637M,OLID:OL1631378M,OLID:OL979600M,OLID:OL33674M,OLID:OL7950349M,OLID:OL349749M,OLID:OL30460M,OLID:OL24347578M&jscmd=data&format=json');
            });
        });
    });
});

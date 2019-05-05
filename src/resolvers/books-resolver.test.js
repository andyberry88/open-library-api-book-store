/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import sinon from 'sinon';
import axios from 'axios';

import booksResolver from './books-resolver';
import booksQueryResult from '../open-library-response.json';

chai.use(sinonChai);

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
        const books = await booksResolver();
        expect(books).to.deep.equal([
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
            data: { 'OLID:OL24347578M': booksQueryResult['OLID:OL24347578M'] },
        });
        const books = await booksResolver();
        expect(books).to.deep.equal([
            {
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
            },
        ]);
    });
});

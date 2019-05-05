/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import sinon from 'sinon';
import axios from 'axios';

import booksResolver from './books-resolver';

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
                    foo: 'bar',
                },
                id2: {
                    bar: 'baz',
                },
            },
        });
        const books = await booksResolver();
        expect(books).to.deep.equal([
            {
                id: 'id1',
                foo: 'bar',
            },
            {
                id: 'id2',
                bar: 'baz',
            },
        ]);
    });
});

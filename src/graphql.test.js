/* eslint-disable no-unused-expressions */

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import axios from 'axios';

import typeDefs from './schema';
import resolvers from './resolvers';

import booksQueryResult from './graphql.test-response';

chai.use(sinonChai);

const graphqlQuery = (query) => graphql(
    makeExecutableSchema({
        typeDefs,
    }),
    query,
    resolvers,
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
            axios.get.resolves(booksQueryResult);
            const graphqlResult = await graphqlQuery(`query {
                books {
                    title
                    author
                }
            }`);
            expect(graphqlResult).not.to.contain.keys('errors');
        });
    });
});

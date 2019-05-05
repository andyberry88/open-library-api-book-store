
import booksResolver from './resolvers/books-resolver';

export default {
    Query: {
        books: booksResolver,
    },
};

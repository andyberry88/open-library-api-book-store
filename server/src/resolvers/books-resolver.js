import axios from 'axios';
import map from 'lodash/map';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import get from 'lodash/get';

const defaultBibkeys = [
    'OLID:OL22895148M',
    'OLID:OL6990157M',
    'OLID:OL7101974M',
    'OLID:OL6732939M',
    'OLID:OL7193048M',
    'OLID:OL24347578M',
    'OLID:OL24180216M',
    'OLID:OL24948637M',
    'OLID:OL1631378M',
    'OLID:OL979600M',
    'OLID:OL33674M',
    'OLID:OL7950349M',
    'OLID:OL349749M',
    'OLID:OL30460M',
    'OLID:OL24347578M',
];

const olidRegex = /(OLID:)[a-zA-Z0-9]+/;

export default async (root, { search } = {}) => {
    const isSearching = typeof search !== 'undefined' && search.length > 0;
    const isSearchingByBibkey = isSearching && olidRegex.test(search);
    const bibkeys = isSearchingByBibkey ? [search] : defaultBibkeys;
    const booksResult = await axios.get(`https://openlibrary.org/api/books?bibkeys=${bibkeys.join(',')}&jscmd=data&format=json`);
    if (typeof booksResult === 'undefined' || booksResult.data === 'undefined') {
        return [];
    }
    const books = map(booksResult.data, (bookDetails, bookId) => omitBy({
        ID: bookId,
        title: bookDetails.title,
        url: bookDetails.url,
        numberOfPages: bookDetails.number_of_pages,
        coverUrl: get(bookDetails, 'cover.medium', undefined),
        authors: bookDetails.authors,
        publishers: bookDetails.publishers,
        publishDate: bookDetails.publish_date,
    }, isNil));
    if (isSearching && !isSearchingByBibkey) {
        const searchLowerCase = search.toLowerCase();
        return books.filter((book) => book.title.toLowerCase().indexOf(searchLowerCase) !== -1);
    }
    return books;
};

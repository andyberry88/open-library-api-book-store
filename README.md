# Open Library API Book Store

## Challenge

**Brief: Create an Amazon-like bookstore using the Open Library API**

### Exercise Summary

Design and implement code that is capable of querying the [Open Library API](https://openlibrary.org/developers/api). Present the
results in some form on a web page. Bonus points for demonstrating a test driven approach
somewhere in the implementation.

### Background

It's 1999 and we're building the first version of an Amazon-like bookstore using the Open
Library API. As a first step, we want to build a page that lists books from the API, displaying
the book cover image, title, author, and open library Id number (OLID). Formatting isn't ultra
important (it is 1999 after all).

We'd also like a search form that allows us to filter (on the server side) by the book's title or
OLID. If searching by OLID, we should validate it before we send it to our server. If it's not a
valid OLID, then we can assume it's a title.

The book search API documentation is available [here](https://openlibrary.org/developers/api), and [here](https://openlibrary.org/api/books?bibkeys=OLID:OL22895148M,OLID:OL6990157M,OLID:OL7101974M,OLID:OL6732939M,OLID:OL7193048M,OLID:OL24347578M,OLID:OL24180216M,OLID:OL24948637M,OLID:OL1631378M,OLID:OL979600M,OLID:OL33674M,OLID:OL7950349M,OLID:OL349749M,OLID:OL30460M,OLID:OL24347578M&jscmd=data&format=json) is an example of the API
response, but we should fetch a fresh copy from the API each time.

### Getting Started

We'd like the exercise to be completed using Node.js in some form but you are free to use any
additional tools to accomplish the task e.g. you might use standard HTML and CSS for the
frontend, or you might use React; you may choose to use hapi or express for the server.

### Key Objectives

- Clean, well-structured code
- A logical approach to implementation
- Appropriate use of third party libs
- Some test coverage

## My Approach

- The server is a GraphQL API which queries the Open Library API
  - The API allows searching by title or OLID (the OLAPI doesn't appear to allow searching by title)
  - If the query param is a valid OLID it will query the OLAPI for that OLID
  - If the query param isnt a valid OLID, it queries the OLAPI with a predefined set of OLIDS and then filters by title.
- The client is a basic React client which queries the GrahpQL API

**Running the app**

- run `yarn install` in both `client` and `server`
- run `yarn test` to run tests (there are currently tests in `server`, but no meaningful tests in `client`)
- run `yarn start` in both `client` and `server` to run the app
  - The app is hosted at http://localhost:3000/
  - There is a GraphQL UI at http://localhost:4000/. Use the query below to query for the title and author of all books

```
{
  books {
    ID
    title
    authors {
      name
    }
  }
}
```

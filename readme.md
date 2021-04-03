# Exercise for Second Front Systems - Some Kind of Book Search with Cats

https://github.com/second-front/exercise

Uses [Bootstrap](https://getbootstrap.com/) and [jQuery](https://jquery.com/) with no plug-ins. I chose APIs that didn't require any authentication for simplicity (albeit usefulness is very low).

## Start
Run `node server.js` to start web server. Navigate to http://localhost:8081 to view.

## Use
Enter a term into the Search field to get a list of books that match from [Open Library](https://openlibrary.org/), for example "Lord of the Rings". Author names, ISBN's, or just about any other term can be used in the search.

Within the search results click on an author name or ISBN to do a new search for the author or ISBN. Click on a title to bring up more details about that book.

## Improvements
- Rows of book results instead of one column.
- More robust search function and URL params.
- Better pagination.
- More detailed book results by making a call to openlibrary.org/book/<isbn>.
- Book covers and author photos would have been nice, but the api limits to 5 calls per minute. Openlibrary offers bulk download of book covers for local hosting, but it's a big download.
- More DRY, repeat the add cat logic (among other things) too much.
- Formal/automated tests.

## Some Tests
- Search for 'asdfdsfdas' will have no results.
- Search for 'dsa' will give 166 results (two pages).
- Search for 'unknown' will give 14104 results (many pages).
- Blank search will result in cat help.

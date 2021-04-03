let currentPage = 1; //eh it's a global
let maxPages = 0;
let currentSearch = ''

/* Some results can be in an array, deal with that here. */
function getFirstThing(thing) {
    let retValue = 'Unknown';

    switch (typeof(thing)) {
        case 'string':
            retValue = thing;
            break;

        case 'object':
            retValue = thing[0];
            break;
    }

    return retValue;
}

/**
 * Replace {{vars}} in template.
 * @param template - jquery element of template to use.
 * @param data - object to use to replace template variables.
 * @return - jquery element with template vars repalced by data.
 */
function replaceTemplateVars(template, data) {

    let el = template;

    for (const each in data) {
        let re = new RegExp('{{' + each + '}}', 'g');
        el = el.replace(re, data[each])
    }

    return el;
}

/* Resets resultsWindow to default. */
function clearResutls() {
    $('#resultWindow').html('<div id="noResults" class="mt-4">Search to show results.</div>');
}

/* Put a cat at end of search results. */
function getEndCat() {
    setTimeout(function() {

        $.getJSON('https://aws.random.cat/meow', function(data) {

            catUrl = {
                caturl: data.file
            }

            catpic = replaceTemplateVars($('<div><p><b>End of Results</b></p><img src="{{caturl}}" /></div>').html(), catUrl);
            $('#resultWindow').append(catpic);
        });

    }, 1000);
}

/* */
function search() {
    let searchFor = currentSearch;

    // Check if search has text.
    if (searchFor !== '') {

        // Format search string.
        searchFor = searchFor.split(' ');
        let searchString = '';
        searchFor.forEach((item, i) => {
            searchString += '+' + item;
        });
        searchString = searchString.substring(1);

        let query = 'http://openlibrary.org/search.json?q=' + searchString + '&page=' + currentPage.toString()

        // API call to Open Library.
        $.getJSON(query, function(data) {

            // Display a cat if no results are found :(
            if (data.numFound === 0) {
                $.getJSON('https://aws.random.cat/meow', function(data) {

                    data = {
                        caturl: data.file,
                        searchString: searchString
                    }

                    let helpTemplate = replaceTemplateVars($.trim($('#searchNoResultsTemplate').html()), data);
                    $('#resultWindow').html(helpTemplate);
                });
            }

            // Replace everything in results window.
            let resultsData = {
                first: data.start + 1,
                last: data.start + data.docs.length,
                total: data.numFound
            }
            let pagesTemplate = replaceTemplateVars($.trim($('#pagesTemplate').html()), resultsData);
            $('#resultWindow').html(pagesTemplate);
            maxPages = parseInt(data.numFound / 100) + 1


            for (let i = 0; i < data.docs.length; i++) {

                let title = getFirstThing(data.docs[i].title);
                let author = getFirstThing(data.docs[i].author_name);
                let isbn = getFirstThing(data.docs[i].isbn);

                let bookData = {
                    id: i,
                    title: title,
                    author: author,
                    isbn: isbn
                };

                let bookTemplate = replaceTemplateVars($.trim($('#bookTemplate').html()), bookData);
                $('#resultWindow').append(bookTemplate);

                let bookDetails = {
                    id: i,
                    title: title,
                    author: data.docs[i].author_name,
                    isbn: data.docs[i].isbn
                };

                let bookDetailsTemplate = replaceTemplateVars($.trim($('#bookDetailsTemplate').html()), bookDetails);
                $('#resultWindow').append(bookDetailsTemplate);
            }
        });

        // Last page, show a cat!
        if (currentPage == maxPages) {
            getEndCat(); // [TODO]: for some reason this only shows when user clicks search button, not when hitting enter or url param.
        }

    } else { // If no text to serach for, show help.
        $.getJSON('https://aws.random.cat/meow', function(data) {

            catUrl = {
                caturl: data.file
            }

            let helpTemplate = replaceTemplateVars($.trim($('#searchHelpTemplate').html()), catUrl);
            $('#resultWindow').html(helpTemplate);
        });

    }
}


$(document).ready(function() {

    clearResutls();

    let queryString = decodeURI(window.location.search);
    if (queryString !== '') {
        queryString = queryString.substring(1);
        queryString = queryString.split('=');
        if (queryString[0] == 'search') { // not expecting any other params, but they'll be ignored
            currentSearch = queryString[1];
            $('#searchFor').val(queryString[1])
            search()
        }
    }

    $('#home').click(function() {
        clearResutls();
    });

    // Search button clicked
    $('#search').click(function() {
        currentPage = 1;
        currentSearch = $('#searchFor').val().trim();
        search();
    });

    // Super annoying to not just hit enter.
    $('#searchFor').keypress(function(e) {
        if (e.which == 13) {
            currentPage = 1;
            currentSearch = $('#searchFor').val().trim();
            search();
            return false; //this is interesting: https://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
        }
    });
});

$(document).on('click', '#prev', function() {
    if (currentPage > 1) {
        currentPage = currentPage - 1;
        search();
    }
});

$(document).on('click', '#next', function() {
    if (currentPage < maxPages) {
        currentPage = currentPage + 1;
        search();
    }
});
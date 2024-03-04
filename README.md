This node.js program ingests ratings.csv, which containing book reviews in the following format (Book Title, Reviewer Name, Score): 

    ex: Harry Potter,James Bond,5

For each book, the following properties are calculated based on it's reviews:

    Average Rating
    Number of Favorites (Score = 5)

It then updates this [Notion Database](https://jungle-glove-ea5.notion.site/b71bc90e86c74117868376c6e09f4695?v=45eb270c229d4bdb9225b007ced63b59&pvs=4).

## Usage

Open a terminal and navigate to the root directory of this file, then run the following commands:

    $ npm i
    $ node .

Note: an .env file and NOTION API KEY are only included for the sake of convenience for this reviewers of this assessment, no additional configuration needed.

## Testing

This program includes a suite of unit tests. Run the following command to test:

    $ npm test  

## How this works

The **processRatingsCSVBuffer** function processes a CSV buffer containing ratings data. It interacts with a database to update existing ratings, add new ones, and delete outdated ratings. It does this by parsing the CSV data, querying the database, generating promises for only the necessary operations, executing these operations in parallel, and providing feedback on the success or failure of the operations.

The following utilities are used:

    parseRatingsCSVBuffer - Parses the ratings CSV buffer to extract ratings data
    getRatingsToUpdateOrAddPromises - Retrieves promises for updating or adding ratings in a database
    getRatingsToDeletePromises - Retrieves promises for deleting outdated ratings from a database.

The **processRatingsCSVBuffer** function optimizes by querying existing data first to determine whether rows need to be updated, deleted, or left unchanged. This helps prevent unnecessary API calls for deleting and recreating the same page object.

## parseRatingsCSVBuffer
This function takes a CSV buffer string containing book ratings, processes the data, and calculates average ratings and the number of favorites for each book

Example:

    Input (CSV buffer string):
    
    book1,Daniel H,5
    book2,David H,4
    book3,Alice B,3

    Output: 
    
    [
        { "book_title": "book1", "avg_rating": 5, "num_favorites": 1 },
        { "book_title": "book2", "avg_rating": 4, "num_favorites": 0 },
        { "book_title": "book3", "avg_rating": 3, "num_favorites": 0 }
    ]

Here's a high level explanation of how it works:

    1. Splits the CSV content into rows.
    2. Process each row, normalize book titles and user names, and extracts ratings.
    3. Updates book ratings object with user's ratings, considering only the last rating for duplicate book ratings by the same user.
    4. Calculates the average rating and the number of favorites for each book based on the processed data.

Each book's ratings are stored in a map indexed by book title. Each entry in this map contains a user_ratings key, which is a map that stores each unique user's rating for that particular book. 

    {
        "book1": {
            "user_ratings": {
                "user1": {
                    "rating": 4
                },
                "user2": {
                    "rating": 5
                }
            }
        },
        "book2": {
            "user_ratings": {
                "user1": {
                    "rating": 3
                },
                "user3": {
                    "rating": 4
                }
            }
        }
    }    

### Motivation
This approach of storing ratings in a map indexed by book title and each book entry containing a user_ratings map provides flexibility for future enhancements. Adding additional data points for each user, such as written reviews, or including more data points for each book can be easily accommodated within the existing structure. The flexibility allows for seamless expansion of the data model to incorporate new information without requiring significant changes to the existing implementation.

### Trade offs:
TODO

**Ignoring duplicate user reviews:** 
When processing duplicate ratings for the same book by the same user, the new rating will override the old one in the user_ratings map, ensuring that only the latest review is taken into account for each user.

## Short answers

1. **Dificulties experienced**: No major difficulties. Was not sure how to mock notion database query responses in Jest, so instead, I hard coded a response object. 

2. **NOTION API Docs suggestions**: For the [update page documentation](https://developers.notion.com/reference/patch-page), the response codes are not exhaustive. It is possible to receive the 409 error code, however, this code is not included in the responses list. Also, I expected to see an explanation when expanding each response code. Since an explanation isn't present, it isn't immediately clear what each response code means. The user is forced to either navigate to the [status codes](https://developers.notion.com/reference/status-codes) page via the left sidebar, which is hard to see, or toggle through the response examples on the right sidebar below the API request code snippet, which is not immediately obvious as a toggleable element. 

## Major source links

[Jest documentation](https://jestjs.io/docs/getting-started)

[How to using ESM import syntax with Jest](https://stackoverflow.com/questions/58613492/how-to-resolve-cannot-use-import-statement-outside-a-module-from-jest-when-run)

## Major libraries used

[dotenv](https://www.npmjs.com/package/dotenv) - Loading environment variables from a .env file into process.env (Notion API key)

[jest](https://jestjs.io/) - JS testing framework, used for unit test suite

[babel-jest](https://www.npmjs.com/package/babel-jest) - Allows jest to compile code using Babel

[@babel/preset-env](https://babel.dev/docs/babel-preset-env) - A smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms 


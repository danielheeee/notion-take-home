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

## Short answers

2. For the [update page documentation](https://developers.notion.com/reference/patch-page), the response codes are not exhaustive. It is possible to receive the 409 error code, however, this code is not included in the responses list. Also, I expected to see an explanation when expanding each response code. Since an explanation isn't present, it isn't immediately clear what each response code means. The user is forced to either navigate to the [status codes](https://developers.notion.com/reference/status-codes) page via the left sidebar, which is hard to see, or toggle through the response examples on the right sidebar below the API request code snippet, which is not immediately obvious as a toggleable element. 

## Major source links

[Jest documentation](https://jestjs.io/docs/getting-started)

[How to using ESM import syntax with Jest](https://stackoverflow.com/questions/58613492/how-to-resolve-cannot-use-import-statement-outside-a-module-from-jest-when-run)

## Major libraries used

[dotenv](https://www.npmjs.com/package/dotenv) - Loading environment variables from a .env file into process.env (Notion API key)

[jest](https://jestjs.io/) - JS testing framework, used for unit test suite

[babel-jest](https://www.npmjs.com/package/babel-jest) - Allows jest to compile code using Babel

[@babel/preset-env](https://babel.dev/docs/babel-preset-env) - A smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms 


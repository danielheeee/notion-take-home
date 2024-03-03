This program ingests a .csv file containing book reviews in the following format (Book Title, Reviewer Name, Score): 

    ex: Harry Potter,James Bond,5

For each book, the following properties are calculated based on it's reviews:

    Average Rating
    Number of Favorites (Score = 5)

It then updates this [Notion Database](https://jungle-glove-ea5.notion.site/b71bc90e86c74117868376c6e09f4695?v=45eb270c229d4bdb9225b007ced63b59&pvs=4).

## Usage

Open a terminal and navigate to the root directory of this file, then run the following commands:

    $ npm i
    $ node .

## Testing

This program includes a suite of unit tests. Run the following command to test:

    $ npm test    


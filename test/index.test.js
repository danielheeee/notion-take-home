import { parseRatings } from '../src/parseRatings.js';
import fs from "fs"

// Mock fs to simulate reading a file
jest.mock('fs', () => ({
    readFileSync: jest.fn().mockReturnValue('book1,Daniel,5')
}));

describe('parseRatings', () => {


    it('Multiple ratings for the same book by the same member', async () => {

        const csvBuffer =
            `book1,Daniel H,0
            book1,Daniel H,1`

        const expected = [
            { book_title: 'book1', avg_rating: 1, num_favorites: 0 },
        ];

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })

    it('Multiple ratings for the same book by the same member with mixed capitalization and whitespace', async () => {

        const csvBuffer =
            `book1,Daniel H,5
            book1, dAnIeL H  ,4`

        const expected = [
            { book_title: 'book1', avg_rating: 4, num_favorites: 0 },
        ];

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })

    it('Multiple ratings for the same book with different capitalization and whitespace by the different members', async () => {

        const csvBuffer =
            `book 1,user1,1
             book 1,user2,2
              book 1,user3,3
            book 1 ,user4,4
            book 1  ,user5,5
             book 1 ,user6,3
              book 1  ,user7,3`

        const expected = [
            { book_title: 'book 1', avg_rating: 3, num_favorites: 1 },
        ];

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })


    it('Ratings not in order', async () => {
        const csvBuffer =
            `book1,Daniel H,2
            book2,Daniel H,3
            book1,David H,4`

        const expected = [
            { "book_title": "book1", "avg_rating": 3, "num_favorites": 0 },
            { "book_title": "book2", "avg_rating": 3, "num_favorites": 0 }
        ]

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })

    it('Ratings of 5 are counted as favorites', async () => {
        const csvBuffer =
            `book1,Daniel H,5
            book2,David H,5
            book1,David H,5
            book3,Alice B,4`

        const expected = [
            { "book_title": "book1", "avg_rating": 5, "num_favorites": 2 },
            { "book_title": "book2", "avg_rating": 5, "num_favorites": 1 },
            { "book_title": "book3", "avg_rating": 4, "num_favorites": 0 }
        ]

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })

    it('Multiple ratings of 5 from same user does not double count favorites', async () => {
        const csvBuffer =
            `book1,Daniel H,5
            book1,Daniel H,5`

        const expected = [
            { "book_title": "book1", "avg_rating": 5, "num_favorites": 1 },
        ]

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })
})
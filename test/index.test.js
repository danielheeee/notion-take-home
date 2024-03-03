import { parseRatings } from '../src/parseRatings.js';

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

    it('Multiple ratings for the same book with different capitalization and whitespace by different members', async () => {

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

    it('Ratings with score 5 are counted as favorites', async () => {
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

    it('Multiple ratings with score 5 from same user only counted as one favorite', async () => {
        const csvBuffer =
            `book1,Daniel H,5
            book1,Daniel H,5`

        const expected = [
            { "book_title": "book1", "avg_rating": 5, "num_favorites": 1 },
        ]

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    })

    it('Deterministic results for identical inputs', async () => {
        const csvBuffer1 =
            `book1,Daniel H,5
            book2,David H,4
            book3,Alice B,3`

        const csvBuffer2 =
            `book1,Daniel H,5
            book2,David H,4
            book3,Alice B,3`

        const expected = [
            { "book_title": "book1", "avg_rating": 5, "num_favorites": 1 },
            { "book_title": "book2", "avg_rating": 4, "num_favorites": 0 },
            { "book_title": "book3", "avg_rating": 3, "num_favorites": 0 }
        ]

        const result1 = await parseRatings(csvBuffer1);
        const result2 = await parseRatings(csvBuffer2);

        expect(result1).toEqual(expected);
        expect(result2).toEqual(expected);
        expect(result1).toEqual(result2); // Ensure determinism by comparing the two results directly
    })

    it('Deterministic results for identical inputs with different orders', async () => {
        const csvBuffer1 =
            `book1,Daniel H,5
            book2,David H,4
            book3,Alice B,3`

        const csvBuffer2 =
            `book3,Alice B,3
            book1,Daniel H,5
            book2,David H,4`

        const expected = [
            { "book_title": "book1", "avg_rating": 5, "num_favorites": 1 },
            { "book_title": "book2", "avg_rating": 4, "num_favorites": 0 },
            { "book_title": "book3", "avg_rating": 3, "num_favorites": 0 }
        ]

        const result1 = await parseRatings(csvBuffer1);
        const result2 = await parseRatings(csvBuffer2);

        // Sort actual results by book_title lexographically before comparison
        expect(result1.sort((a, b) => a.book_title.localeCompare(b.book_title))).toEqual(expected);
        expect(result2.sort((a, b) => a.book_title.localeCompare(b.book_title))).toEqual(expected);
        expect(result1).toEqual(result2); // Ensure determinism by comparing the two results directly
    })


})
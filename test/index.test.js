import { parseRatings } from '../src/parseRatings.js';
import fs from "fs"

// Mock fs to simulate reading a file
jest.mock('fs', () => ({
    readFileSync: jest.fn().mockReturnValue('book1,Daniel,5')
}));

describe('parseRatings', () => {
    it('parses CSV content correctly', async () => {

        const csvBuffer = await fs.readFileSync('ratings.csv', 'utf8')

        const expected = [
            { book_title: 'book1', avg_rating: 5, num_favorites: 1 },
        ];

        const result = await parseRatings(csvBuffer);
        expect(result).toEqual(expected);
    });
});
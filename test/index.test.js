import { getRatingsToDeletePromises } from "../src/getRatingsToDeletePromises.js";
import { getRatingsToUpdateOrAddPromises } from "../src/getRatingsToUpdateOrAddPromises.js";
import { parseRatingsCSVBuffer } from '../src/parseRatingsCSVBuffer.js';

// Mock fs to simulate reading a file
jest.mock('fs', () => ({
    readFileSync: jest.fn().mockReturnValue('book1,Daniel,5')
}));

describe('parseRatingsCSVBuffer', () => {

    describe('Single rating for one book', () => {
        it('where rating < 5', async () => {
            const csvBuffer = `book1,Daniel H,4`;

            const expected = [
                { book_title: 'book1', avg_rating: 4, num_favorites: 0 },
            ];

            const result = await parseRatingsCSVBuffer(csvBuffer);
            expect(result).toEqual(expected);
        })
        it('where rating = 5', async () => {
            const csvBuffer = `book1,Daniel H,5`;

            const expected = [
                { book_title: 'book1', avg_rating: 5, num_favorites: 1 },
            ];

            const result = await parseRatingsCSVBuffer(csvBuffer);
            expect(result).toEqual(expected);
        })
    })
    describe('Multiple ratings for the same book', () => {
        describe('By the same member', () => {
            describe('With same member name capitalization and whitespace', () => {
                it('where all ratings < 5', async () => {
                    const csvBuffer =
                        `book1,Daniel H,0
                        book1,Daniel H,1`

                    const expected = [
                        { book_title: 'book1', avg_rating: 1, num_favorites: 0 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where most recent rating = 5', async () => {
                    const csvBuffer =
                        `book1,Daniel H,0
                        book1,Daniel H,5`

                    const expected = [
                        { book_title: 'book1', avg_rating: 5, num_favorites: 1 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where a rating = 5 but is not most recent', async () => {
                    const csvBuffer =
                        `book1,Daniel H,5
                        book1,Daniel H,3`

                    const expected = [
                        { book_title: 'book1', avg_rating: 3, num_favorites: 0 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where all ratings = 5', async () => {
                    const csvBuffer =
                        `book1,Daniel H,5
                        book1,Daniel H,5
                        book1,Daniel H,5`

                    const expected = [
                        { book_title: 'book1', avg_rating: 5, num_favorites: 1 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
            })
            describe('With different member name capitalization and whitespace', () => {
                it('where all ratings < 5', async () => {
                    const csvBuffer =
                        `book1,DANIEL H,0
                        book1,   daniel h  ,1`

                    const expected = [
                        { book_title: 'book1', avg_rating: 1, num_favorites: 0 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where most recent rating = 5', async () => {
                    const csvBuffer =
                        `book1,DANIEL H,0
                        book1,   daniel h  ,5`

                    const expected = [
                        { book_title: 'book1', avg_rating: 5, num_favorites: 1 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where a rating = 5 but is not most recent', async () => {
                    const csvBuffer =
                        `book1,DANIEL H,5
                        book1,   daniel h  ,3`

                    const expected = [
                        { book_title: 'book1', avg_rating: 3, num_favorites: 0 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where all ratings = 5', async () => {
                    const csvBuffer =
                        `book1,Daniel H,5
                        book1,DANIEL H,5
                        book1,   daniel h  ,5`

                    const expected = [
                        { book_title: 'book1', avg_rating: 5, num_favorites: 1 },
                    ]

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
            })
        })

        describe('By different members (unique)', () => {
            describe('With same book name capitalization and whitespace', () => {
                it('where all ratings < 5', async () => {
                    const csvBuffer =
                        `book 1,user1,1
                        book 1,user2,2
                        book 1,user3,3
                        book 1,user4,4
                        book 1,user5,3
                        book 1,user6,3
                        book 1,user7,3`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 2.71, num_favorites: 0 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where some ratings = 5', async () => {
                    const csvBuffer =
                        `book 1,user1,1
                        book 1,user2,2
                        book 1,user3,3
                        book 1,user4,4
                        book 1,user5,5
                        book 1,user6,5
                        book 1,user7,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 3.57, num_favorites: 3 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where all ratings = 5', async () => {
                    const csvBuffer =
                        `book 1,user1,5
                        book 1,user2,5
                        book 1,user3,5
                        book 1,user4,5
                        book 1,user5,5
                        book 1,user6,5
                        book 1,user7,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 5, num_favorites: 7 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
            })
            describe('With different book name capitalization and whitespace', () => {
                it('where all ratings < 5', async () => {
                    const csvBuffer =
                        `book 1,user1,1
                         book 1,user2,2
                          book 1,user3,3
                        book 1 ,user4,4
                        book 1  ,user5,3
                         book 1 ,user6,3
                          book 1  ,user7,3`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 2.71, num_favorites: 0 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where some ratings = 5', async () => {
                    const csvBuffer =
                        `book 1,user1,1
                    book 1,user2,2
                     book 1,user3,3
                   book 1 ,user4,4
                   book 1  ,user5,5
                    book 1 ,user6,5
                     book 1  ,user7,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 3.57, num_favorites: 3 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where all ratings = 5', async () => {
                    const csvBuffer =
                        `book 1,user1,5
                         book 1,user2,5
                          book 1,user3,5
                        book 1 ,user4,5
                        book 1  ,user5,5
                         book 1 ,user6,5
                          book 1  ,user7,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 5, num_favorites: 7 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
            })
        })

        describe('By different members (contains duplicates)', () => {
            describe('With duplicate reviews from same member', () => {
                it('where all ratings < 5', async () => {
                    const csvBuffer =
                        `book 1,user1,1
                        book 1,user1,2
                        book 1,user1,3
                        book 1,user2,4
                        book 1,user3,3`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 3.33, num_favorites: 0 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where some ratings = 5, including most recent duplicate review', async () => {
                    const csvBuffer =
                        `book 1,user1,1
                            book 1,user1,2
                            book 1,user1,5
                            book 1,user2,4
                            book 1,user3,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 4.67, num_favorites: 2 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where some ratings = 5, not including most recent duplicate review', async () => {
                    const csvBuffer =
                        `book 1,user1,5
                            book 1,user1,5
                            book 1,user1,3
                            book 1,user2,4
                            book 1,user3,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 4, num_favorites: 1 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
                it('where all ratings = 5', async () => {
                    const csvBuffer =
                        `book 1,user1,5
                            book 1,user1,5
                            book 1,user1,5
                            book 1,user2,4
                            book 1,user3,5`

                    const expected = [
                        { book_title: 'book 1', avg_rating: 4.67, num_favorites: 2 },
                    ];

                    const result = await parseRatingsCSVBuffer(csvBuffer);
                    expect(result).toEqual(expected);
                })
            })
        })
    })

    describe('Multiple ratings for the same book with different book name capitalization and whitespace', () => {
        it('by the same member', async () => {

            const csvBuffer =
                `book 1,user1,1
                 book 1,user1,2
                  book 1,user1,3
                book 1 ,user1,4
                book 1  ,user1,5
                 book 1 ,user1,3
                  book 1  ,user1,3`

            const expected = [
                { book_title: 'book 1', avg_rating: 3, num_favorites: 0 },
            ];

            const result = await parseRatingsCSVBuffer(csvBuffer);
            expect(result).toEqual(expected);
        })
        it('By the same member with mixed capitalization and whitespace', async () => {

            const csvBuffer =
                `book 1,user1,1
                 book 1, user1,2
                  book 1,  user1,3
                book 1 ,user1 ,4
                book 1  ,user1  ,5
                 book 1 , user1 ,3
                  book 1  ,  user1  ,3`

            const expected = [
                { book_title: 'book 1', avg_rating: 3, num_favorites: 0 },
            ];

            const result = await parseRatingsCSVBuffer(csvBuffer);
            expect(result).toEqual(expected);
        })
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

        const result1 = await parseRatingsCSVBuffer(csvBuffer1);
        const result2 = await parseRatingsCSVBuffer(csvBuffer2);

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

        const result1 = await parseRatingsCSVBuffer(csvBuffer1);
        const result2 = await parseRatingsCSVBuffer(csvBuffer2);

        // Sort actual results by book_title lexographically before comparison
        expect(result1.sort((a, b) => a.book_title.localeCompare(b.book_title))).toEqual(expected);
        expect(result2.sort((a, b) => a.book_title.localeCompare(b.book_title))).toEqual(expected);
        expect(result1).toEqual(result2); // Ensure determinism by comparing the two results directly
    })


})

let existingRatings

beforeAll(() => {
    // List of the following book review page objects (Mocking notion.databases.query)
    // Book Title = Book 1, Avg Rating = 5, Favorites = 1 
    // Book Title = Book 2, Avg Rating = 4, Favorites = 0 
    // Book Title = Book To Delete, Avg Rating = 3, Favorites = 0 
    existingRatings = [{ "object": "page", "id": "10175cc0-59e1-4226-b3cc-7c697a94f0a4", "created_time": "2024-03-04T03:23:00.000Z", "last_edited_time": "2024-03-04T03:23:00.000Z", "created_by": { "object": "user", "id": "cedac5d1-6b31-4236-b7a0-9970a8f2aa6a" }, "last_edited_by": { "object": "user", "id": "cedac5d1-6b31-4236-b7a0-9970a8f2aa6a" }, "cover": null, "icon": null, "parent": { "type": "database_id", "database_id": "b71bc90e-86c7-4117-8683-76c6e09f4695" }, "archived": false, "properties": { "Favorites": { "id": "Fbql", "type": "number", "number": 0 }, "Avg Rating": { "id": "d%5CF%3C", "type": "number", "number": 3 }, "Book Title": { "id": "title", "type": "title", "title": [{ "type": "text", "text": { "content": "Book To Delete", "link": null }, "annotations": { "bold": false, "italic": false, "strikethrough": false, "underline": false, "code": false, "color": "default" }, "plain_text": "Book To Delete", "href": null }] } }, "url": "https://www.notion.so/Book-To-Delete-10175cc059e14226b3cc7c697a94f0a4", "public_url": "https://jungle-glove-ea5.notion.site/Book-To-Delete-10175cc059e14226b3cc7c697a94f0a4" }, { "object": "page", "id": "f0f44686-5449-446d-b841-1bf05e5bb571", "created_time": "2024-03-04T03:23:00.000Z", "last_edited_time": "2024-03-04T03:23:00.000Z", "created_by": { "object": "user", "id": "cedac5d1-6b31-4236-b7a0-9970a8f2aa6a" }, "last_edited_by": { "object": "user", "id": "cedac5d1-6b31-4236-b7a0-9970a8f2aa6a" }, "cover": null, "icon": null, "parent": { "type": "database_id", "database_id": "b71bc90e-86c7-4117-8683-76c6e09f4695" }, "archived": false, "properties": { "Favorites": { "id": "Fbql", "type": "number", "number": 0 }, "Avg Rating": { "id": "d%5CF%3C", "type": "number", "number": 4 }, "Book Title": { "id": "title", "type": "title", "title": [{ "type": "text", "text": { "content": "Book 2", "link": null }, "annotations": { "bold": false, "italic": false, "strikethrough": false, "underline": false, "code": false, "color": "default" }, "plain_text": "Book 2", "href": null }] } }, "url": "https://www.notion.so/Book-2-f0f446865449446db8411bf05e5bb571", "public_url": "https://jungle-glove-ea5.notion.site/Book-2-f0f446865449446db8411bf05e5bb571" }, { "object": "page", "id": "8f2a27bd-7f54-4f68-82ad-88dcd4b3963e", "created_time": "2024-03-04T03:23:00.000Z", "last_edited_time": "2024-03-04T03:23:00.000Z", "created_by": { "object": "user", "id": "cedac5d1-6b31-4236-b7a0-9970a8f2aa6a" }, "last_edited_by": { "object": "user", "id": "cedac5d1-6b31-4236-b7a0-9970a8f2aa6a" }, "cover": null, "icon": null, "parent": { "type": "database_id", "database_id": "b71bc90e-86c7-4117-8683-76c6e09f4695" }, "archived": false, "properties": { "Favorites": { "id": "Fbql", "type": "number", "number": 1 }, "Avg Rating": { "id": "d%5CF%3C", "type": "number", "number": 5 }, "Book Title": { "id": "title", "type": "title", "title": [{ "type": "text", "text": { "content": "Book 1", "link": null }, "annotations": { "bold": false, "italic": false, "strikethrough": false, "underline": false, "code": false, "color": "default" }, "plain_text": "Book 1", "href": null }] } }, "url": "https://www.notion.so/Book-1-8f2a27bd7f544f6882ad88dcd4b3963e", "public_url": "https://jungle-glove-ea5.notion.site/Book-1-8f2a27bd7f544f6882ad88dcd4b3963e" }]
})

describe('gatherRatingsToDeletePromises', () => {


    it('one or more existing ratings not found in new ratings', async () => {

        const csvBuffer =
            `Book 1,Daniel H,5
            Book 2,David H,4`

        const ratings = await parseRatingsCSVBuffer(csvBuffer)
        const deletePromises = await getRatingsToDeletePromises(ratings, existingRatings)

        expect(deletePromises.length).toEqual(1)
    })

    it('all existing ratings are present in new ratings', async () => {

        const csvBuffer =
            `Book 1,Daniel H,5
            Book 2,David H,4
            Book To Delete,Bob Ross,3`

        const ratings = await parseRatingsCSVBuffer(csvBuffer)
        const deletePromises = await getRatingsToDeletePromises(ratings, existingRatings)

        expect(deletePromises.length).toEqual(0)
    })
})

describe('getRatingsToUpdateOrAddPromises', () => {
    describe('A new rating is present in existing ratings', () => {
        it('whose are different from existing rating properties', async () => {
            
            // Book 1 rating in existing ratings is 5
            const csvBuffer =
                `Book 1,Daniel H,4 
                Book 2,David H,4
                Book To Delete,Bob Ross,3`

            const ratings = await parseRatingsCSVBuffer(csvBuffer)
            const updateOrAddPromises = await getRatingsToUpdateOrAddPromises(ratings, existingRatings)

            expect(updateOrAddPromises.length).toEqual(1)
        })
        it('whose properties are same as existing rating properties', async () => {
            
            const csvBuffer =
                `Book 1,Daniel H,5 
                Book 2,David H,4
                Book To Delete,Bob Ross,3`

            const ratings = await parseRatingsCSVBuffer(csvBuffer)
            const updateOrAddPromises = await getRatingsToUpdateOrAddPromises(ratings, existingRatings)

            expect(updateOrAddPromises.length).toEqual(0)
        })
    })
    it('A new rating is not present in existing ratings', async () => {
        const csvBuffer =
                `Book 1,Daniel H,5 
                Book 2,David H,4
                Book To Delete,Bob Ross,3
                A new book,Tony S,5`

            const ratings = await parseRatingsCSVBuffer(csvBuffer)
            const updateOrAddPromises = await getRatingsToUpdateOrAddPromises(ratings, existingRatings)

            expect(updateOrAddPromises.length).toEqual(1)
    })
})
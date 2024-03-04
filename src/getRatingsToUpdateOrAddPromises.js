import { addBookRating } from "./notion-helpers/addBookRating.js";
import { updateBookRating } from "./notion-helpers/updateBookRating.js";

/**
 * Generates a list of promises to either update existing book ratings or add new ones to a Notion database.
 * 
 * This function iterates over a list of book ratings, checks if each book is already present in existing ratings,
 * and then decides whether to update the existing entry or add a new one based on the presence of the book.
 * It uses the book title property of each rating as the key for this comparison.
 * 
 * @param {Object[]} newRatings - An array of objects representing the new ratings, where each object contains a `book_title` property.
 * @param {Object[]} existingRatings - An array of objects representing the existing ratings, where each object has a `properties` object with a "Book Title" key.
 * @param {string} database_id - The ID of the Notion database where the books are stored.
 * @returns {Promise[]} An array of promises representing the operations to be performed (updates and additions) on the database.
 */
export const getRatingsToUpdateOrAddPromises = async (newRatings, existingRatings, database_id) => {

    // Extract titles of existing books in the database for comparison
    const existingBookRatingsMap = new Map(existingRatings.map(rating => {
        const title = rating.properties["Book Title"].title.at(0).plain_text.toLowerCase().trim();
        return [title, rating];
    }));
    
    let promises = []

    // Iterate over each book rating from the CSV file
    for (const { book_title, avg_rating, num_favorites } of newRatings) {

        // Check if the book already exists in the database
        if (!existingBookRatingsMap.has(book_title)) {
            // If the book is not found, add it to the database
            console.log(`Adding "${book_title}" to the database.`)
            promises.push(() => addBookRating(database_id, { book_title, avg_rating, num_favorites }))
        } else {
            // If the book exists, Determine which properties need to be updated based on changes
            const existingBookRating = existingBookRatingsMap.get(book_title)

            const Favorites = existingBookRating.properties["Favorites"]
            const AvgRating = existingBookRating.properties["Avg Rating"]

            let propertiesToUpdate = {
                ...(Favorites.number !== num_favorites && { "Favorites": { ...Favorites, number: num_favorites } }),
                ...(AvgRating.number !== avg_rating && { "Avg Rating": { ...AvgRating, number: avg_rating } }),
            };

            // If there are properties to update, add the update operation to the batch
            if (Object.keys(propertiesToUpdate).length > 0) {
                promises.push(() => updateBookRating(existingBookRating.id, propertiesToUpdate))
            } else {
                console.log(`Book titled "${book_title}" no update necessary.`)
            }
        }
    }

    return promises
}
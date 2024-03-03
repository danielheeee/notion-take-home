import { deleteBookRating } from "./notion-helpers/deleteBookRating.js";
/**
 * Generates a list of promises for deleting book ratings that are not present in the new ratings.
 * 
 * This function compares the titles of books in the new ratings against the existing ratings.
 * If a book title from the existing ratings is not found in the new ratings, a promise to delete
 * that book rating is added to the list. The function returns this list of promises.
 * 
 * @param {Object[]} newRatings - An array of objects representing the new ratings, where each object contains a `book_title` property.
 * @param {Object[]} existingRatings - An array of objects representing the existing ratings, where each object has a `properties` object with a "Book Title" key.
 * @returns {Promise[]} An array of promises, each promise corresponds to a delete operation for a book rating not present in the new ratings.
 */
const getRatingsToDeletePromises = (newRatings, existingRatings) => {

    let promises = []

    const ratingsTitles = new Set(newRatings.map(rating => rating.book_title.toLowerCase().trim()));

    existingRatings.forEach(rating => {
        // Check if the book in the database is not present in the new ratings
        const existingBookTitle = rating.properties["Book Title"].title.at(0).plain_text.toLowerCase().trim()

        if (!ratingsTitles.has(existingBookTitle)) {
            // If not present, create promise to delete the rating from the database
            console.log(`"${existingBookTitle}" is not present in the new ratings, deleting.`)
            promises.push(deleteBookRating(rating.id))
        }
    });

    return promises
}

export default getRatingsToDeletePromises;
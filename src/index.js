#! /usr/bin/env node

import fs from "fs";
import { parseRatings } from "./parseRatings.js";
import { addBookRating } from "./addBookRating.js"
import { updateBookRating } from "./updateBookRating.js"
import { deleteBookRating } from "./deleteBookRating.js"
import { notion } from "./utils/notion.js";

const database_id = 'b71bc90e86c74117868376c6e09f4695'
const csvBuffer = await fs.readFileSync('ratings.csv', 'utf8')

async function main() {

    // Parse the CSV file to get book ratings
    const ratings = await parseRatings(csvBuffer)
    // Query the Notion database to get existing book entries
    const response = await notion.databases.query({ database_id })

    // Extract titles of existing books in the database for comparison
    const existingBookRatingsMap = new Map(response.results.map(result => {
        const title = result.properties["Book Title"].title.at(0).plain_text.toLowerCase().trim();
        return [title, result];
    }));
    // Initialize an array to hold operations (promises) for parallel execution
    const operations = []

    // Iterate over each book rating from the CSV file
    for (const { book_title, avg_rating, num_favorites } of ratings) {

        // Check if the book already exists in the database

        if (!existingBookRatingsMap.has(book_title)) {
            // If the book is not found, add it to the database
            console.log(`Adding "${book_title}" to the database.`)
            operations.push(addBookRating(database_id, { book_title, avg_rating, num_favorites }))
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
                operations.push(updateBookRating(existingBookRating.id, propertiesToUpdate))
            } else {
                console.log(`Book titled "${book_title}" no update necessary.`)
            }
        }
    }

    // Delete existing book ratings not present in the new ratings
    const ratingsTitles = new Set(ratings.map(rating => rating.book_title.toLowerCase().trim()));

    response.results.forEach(result => {
        // Check if the book in the database is not present in the new ratings
        const existingBookTitle = result.properties["Book Title"].title.at(0).plain_text.toLowerCase().trim()

        if (!ratingsTitles.has(existingBookTitle)) {
            // If not present, delete the book rating from the database
            console.log(`"${existingBookTitle}" is not present in the new ratings, deleting.`)
            operations.push(deleteBookRating(result.id))
        }
    });

    // Execute all add, update, and delete operations in parallel
    await Promise.all(operations)
    console.log('All operations completed successfully.')
}

main().catch(error => {
    console.error('An error occurred during operations:', error)
});
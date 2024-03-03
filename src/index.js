#! /usr/bin/env node

import fs from "fs";
import getRatingsToDeletePromises from "./getRatingsToDeletePromises.js";
import { getRatingsToUpdateOrAddPromises } from "./getRatingsToUpdateOrAddPromises.js";
import { notion } from "./notion-helpers/notion.js";
import { parseRatings } from "./parseRatings.js";

const database_id = 'b71bc90e86c74117868376c6e09f4695'
const csvBuffer = await fs.readFileSync('ratings.csv', 'utf8')

async function main() {

    // Parse the CSV file to get book ratings
    const ratings = await parseRatings(csvBuffer)

    const response = await notion.databases.query({ database_id })

    const updatePromises = await getRatingsToUpdateOrAddPromises(ratings, response.results, database_id)

    const deletePromises = await getRatingsToDeletePromises(ratings, response.results, database_id)

    const operations = [...updatePromises, ...deletePromises]

    // Execute all add, update, and delete operations in parallel
    await Promise.all(operations)
    console.log('All operations completed successfully.')
}

main().catch(error => {
    console.error('An error occurred during operations:', error)
});
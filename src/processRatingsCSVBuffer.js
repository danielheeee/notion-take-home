#! /usr/bin/env node

import { getRatingsToDeletePromises } from "./getRatingsToDeletePromises.js";
import { getRatingsToUpdateOrAddPromises } from "./getRatingsToUpdateOrAddPromises.js";
import { notion } from "./notion-helpers/notion.js";
import { parseRatingsCSVBuffer } from "./parseRatingsCSVBuffer.js";


/**
 * Processes the ratings CSV buffer by adding new ratings, updating existing ones, and deleting outdated ratings in a database.
 * @param {string} csvBuffer - The CSV buffer containing ratings data.
 * @param {string} database_id - The ID of the database to update/delete ratings in.
 */
export const processRatingsCSVBuffer = async (csvBuffer, database_id) => {

    // Parse the CSV buffer to get book ratings
    const ratings = await parseRatingsCSVBuffer(csvBuffer)

    const response = await notion.databases.query({ database_id })

    const updatePromises = await getRatingsToUpdateOrAddPromises(ratings, response.results, database_id)
    const deletePromises = await getRatingsToDeletePromises(ratings, response.results, database_id)

    const operations = [...updatePromises, ...deletePromises]

    // Execute all add, update, and delete operations in parallel
    // NOTE: RATE LIMIT 429 CAUGHT BUT NOT HANDLED...
    await Promise
        .all(operations.map(op => op()))
        .then(() => {
            console.log('All operations completed successfully.')
        })
        .catch(err => console.error(err))
}

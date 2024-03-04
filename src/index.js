#! /usr/bin/env node

import fs from "fs";
import { processRatingsCSVBuffer } from "./processRatingsCSVBuffer.js";


async function main() {

    const database_id = 'b71bc90e86c74117868376c6e09f4695'
    const csvBuffer = await fs.readFileSync('ratings.csv', 'utf8')

    await processRatingsCSVBuffer(csvBuffer, database_id)
}

main().catch(error => {
    console.error('An error occurred during operations:', error)
});
import { notion } from "./notion.js"
import { capitalizeFirstLetterOfEachWord } from "../utils/capitalizeFirstLetterOfEachWord.js"

// Adds a book rating (Notion Page Object) to a Notion Database
export const addBookRating = async (database_id, properties) => {

    const response = await notion.pages.create({
        parent: {
            type: "database_id",
            database_id
        },
        properties: {
            "Book Title": {
                type: "title",
                title: [
                    {
                        text: {
                            content: capitalizeFirstLetterOfEachWord(properties.book_title)
                        }
                    }
                ]
            },
            "Avg Rating": {
                type: "number",
                number: properties?.avg_rating
            },
            "Favorites": {
                type: "number",
                number: properties?.num_favorites
            }
        }
    })

    return response
}

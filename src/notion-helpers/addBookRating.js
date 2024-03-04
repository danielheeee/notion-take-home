import { notion } from "./notion.js"
import { capitalizeFirstLetterOfEachWord } from "../utils/capitalizeFirstLetterOfEachWord.js"


// Adds a book rating (Notion Page Object) to a Notion Database, capitalizing the first letter of each word in the title
export const addBookRating = async (database_id, properties) => {

    return await notion.pages.create({
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

}

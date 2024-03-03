import { notion } from "./utils/notion.js"


export const updateBookRating = async (page_id, properties) => {

    const response = await notion.pages.update({
        page_id,
        properties
    })

    return response
}

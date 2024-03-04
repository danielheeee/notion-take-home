import { notion } from "./notion.js"


export const updateBookRating = async (page_id, properties) => {

    return await notion.pages.update({
        page_id,
        properties
    })

}

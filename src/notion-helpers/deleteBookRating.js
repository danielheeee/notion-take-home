import { notion } from "./notion.js"


export const deleteBookRating = async (page_id) => {

    return await notion.pages.update({
        page_id,
        archived: true,
    })
    
}


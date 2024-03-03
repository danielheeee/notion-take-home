import { notion } from "./utils/notion.js"


export const deleteBookRating = async (page_id) => {

    await notion.pages.update({
        page_id,
        archived: true,
    });
}


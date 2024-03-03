/**
 * Parses a CSV buffer of book ratings and calculates average ratings and the number of favorites for each book.
 * 
 * @param {string} csv_buffer - The CSV content as a string, where each row contains book title, user, and rating.
 * @returns {Promise<Array>} - A promise that resolves to an array of book data, including book title, average ratings and favorites count.
 */
export const parseRatings = async (csv_buffer) => {
    // Split the CSV content into rows.
    const ratings = csv_buffer.split('\n');

    // Initialize an object to hold processed ratings, indexed by book title.
    let results = {};

    // Process each row in the CSV.
    ratings.forEach(row => {
        // Skip empty rows.
        if (!row) return;

        // Split row into properties and normalize book title and user name by trimming and converting to lowercase.
        const [bookTitleRaw, userRaw, ratingRaw] = row.split(",");
        const book_title = bookTitleRaw?.toLowerCase()?.trim();
        const user = userRaw?.toLowerCase()?.trim();
        const rating = parseInt(ratingRaw);

        // Update the results object with the new rating, duplicate book ratings by same user will only consider last rating
        if (book_title in results) {
            results[book_title].user_ratings[user] = { rating };
        } else {
            results[book_title] = { user_ratings: { [user]: { rating } } };
        }
    });

    // Calculate average rating and number of favorites for each book.
    let final_results = Object.entries(results).map(([book_title, data]) => {
        let ratings_sum = 0;
        let num_ratings = 0;
        let num_favorites = 0;

        Object.values(data.user_ratings).forEach(({ rating }) => {
            ratings_sum += rating;
            num_ratings++;
            if (rating === 5) num_favorites++;
        });

        return {
            book_title,
            avg_rating: parseFloat((ratings_sum / num_ratings).toFixed(2)),
            num_favorites
        };
    });

    return final_results;
};
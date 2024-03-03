// This function capitalizes the first letter of each word in a given string.
export const capitalizeFirstLetterOfEachWord = (str) => {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

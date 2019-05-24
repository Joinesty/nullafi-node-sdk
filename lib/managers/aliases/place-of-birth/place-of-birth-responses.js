/**
 * @typedef {Object} CreatePlaceOfBirthResponse
 * @property {string} placeofbirth - Real place of birth
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrievePlaceOfBirthResponse
 * @property {string} id - alias id
 * @property {string} placeofbirth - Real place of birth
 * @property {string} placeofbirthToken - Alias created for place of birth
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeletePlaceOfBirthResponse
 * @property {boolean} ok - If request was successful
 */

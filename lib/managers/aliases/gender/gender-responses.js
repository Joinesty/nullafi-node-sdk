/**
 * @typedef {Object} CreateGenderResponse
 * @property {string} gender - Real Gender
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveGenderResponse
 * @property {string} id - alias id
 * @property {string} gender - Real gender
 * @property {string} genderAlias - Alias created for gender
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteGenderResponse
 * @property {boolean} ok - If request was successful
 */

/**
 * @typedef {Object} CreateLastNameResponse
 * @property {string} lastname - Real last name
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveLastNameResponse
 * @property {string} id - alias id
 * @property {string} lastname - Real last name
 * @property {string} lastnameToken - Alias created for last name
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteLastNameResponse
 * @property {boolean} ok - If request was successful
 */

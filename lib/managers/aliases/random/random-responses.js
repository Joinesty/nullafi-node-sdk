/**
 * @typedef {Object} CreateRandomResponse
 * @property {string} random - Real random
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveRandomResponse
 * @property {string} id - alias id
 * @property {string} random - Real random
 * @property {string} randomToken - Alias created for random
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteRandomResponse
 * @property {boolean} ok - If request was successful
 */

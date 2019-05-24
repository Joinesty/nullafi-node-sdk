/**
 * @typedef {Object} CreatePassportResponse
 * @property {string} passport - Real passport
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrievePassportResponse
 * @property {string} id - alias id
 * @property {string} passport - Real Passport
 * @property {string} passportToken - Alias created for passport
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeletePassportResponse
 * @property {boolean} ok - If request was successful
 */

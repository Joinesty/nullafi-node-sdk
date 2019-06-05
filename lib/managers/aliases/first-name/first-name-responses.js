/**
 * @typedef {Object} CreateFirstNameResponse
 * @property {string} firstname - Real first name
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveFirstNameResponse
 * @property {string} id - alias id
 * @property {string} firstname - Real FirstName
 * @property {string} firstnameAlias - Alias created for first name
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteFirstNameResponse
 * @property {boolean} ok - If request was successful
 */

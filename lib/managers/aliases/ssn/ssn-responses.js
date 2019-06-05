/**
 * @typedef {Object} CreateSsnResponse
 * @property {string} ssn - Real ssn
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveSsnResponse
 * @property {string} id - alias id
 * @property {string} ssn - Real ssn
 * @property {string} ssnAlias - Alias created for ssn
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeletessnResponse
 * @property {boolean} ok - If request was successful
 */

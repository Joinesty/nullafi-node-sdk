/**
 * @typedef {Object} CreateAddressResponse
 * @property {string} address - Real address
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveAddressResponse
 * @property {string} id - alias id
 * @property {string} address - Real address
 * @property {string} addressAlias - Alias created for address
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteAddressResponse
 * @property {boolean} ok - If request was successful
 */

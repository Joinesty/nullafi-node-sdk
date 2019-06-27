/**
 * @typedef {Object} CreateTaxPayerResponse
 * @property {string} taxpayer - Real tax payer ID
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveTaxPayerResponse
 * @property {string} id - alias id
 * @property {string} taxpayer - Real tax payer ID
 * @property {string} taxpayerAlias - Alias created for tax payer ID
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteTaxPayerResponse
 * @property {boolean} ok - If request was successful
 */

/**
 * @typedef {Object} CreateTaxPayerIDResponse
 * @property {string} taxpayerid - Real tax payer ID
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
 /** 
 * @typedef {Object} RetrieveTaxPayerIDResponse
 * @property {string} id - alias id
 * @property {string} taxpayerid - Real tax payer ID
 * @property {string} taxpayeridToken - Alias created for tax payer ID
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
 /** 
 * @typedef {Object} DeleteTaxPayerIDResponse
 * @property {boolean} ok - If request was successful
 */
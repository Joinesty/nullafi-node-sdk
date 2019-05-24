/**
 * @typedef {Object} CreateEmailResponse
 * @property {string} email - Real Email
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
 /** 
 * @typedef {Object} RetrieveEmailResponse
 * @property {string} id - alias id
 * @property {string} email - Real Email
 * @property {string} emailToken - Alias created for Email
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
 /** 
 * @typedef {Object} DeleteEmailResponse
 * @property {boolean} ok - If request was successful
 */
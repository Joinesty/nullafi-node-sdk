/**
 * @typedef {Object} CreateGenericResponse
 * @property {string} generic - Real generic
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
 /** 
 * @typedef {Object} RetrieveGenericResponse
 * @property {string} id - alias id
 * @property {string} generic - Real Generic
 * @property {string} genericToken - Alias created for generic
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
 /** 
 * @typedef {Object} DeleteGenericResponse
 * @property {boolean} ok - If request was successful
 */
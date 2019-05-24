/**
 * @typedef {Object} CreateDateOfBirthResponse
 * @property {string} dateofbirth - Real DateOfBirth
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
 /** 
 * @typedef {Object} RetrieveDateOfBirthResponse
 * @property {string} id - alias id
 * @property {string} dateofbirth - Real date of birth
 * @property {string} dateofbirthToken - Alias created for date of birth
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
 /** 
 * @typedef {Object} DeleteDateOfBirthResponse
 * @property {boolean} ok - If request was successful
 */
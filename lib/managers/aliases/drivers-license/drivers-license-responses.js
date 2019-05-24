/**
 * @typedef {Object} CreateDriversLicenseResponse
 * @property {string} driverslicense - Real drivers license
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
 /** 
 * @typedef {Object} RetrieveDriversLicenseResponse
 * @property {string} id - alias id
 * @property {string} driverslicense - Real DriversLicense
 * @property {string} driverslicenseToken - Alias created for drivers license
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
 /** 
 * @typedef {Object} DeleteDriversLicenseResponse
 * @property {boolean} ok - If request was successful
 */
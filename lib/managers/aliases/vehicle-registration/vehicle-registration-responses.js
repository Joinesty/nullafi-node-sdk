/**
 * @typedef {Object} CreateVehicleRegistrationResponse
 * @property {string} vehicleregistration - Real vehicle registration
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveVehicleRegistrationResponse
 * @property {string} id - alias id
 * @property {string} vehicleregistration - Real vehicle registration
 * @property {string} vehicleregistrationAlias - Alias created for vehicle registration
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteVehicleRegistrationResponse
 * @property {boolean} ok - If request was successful
 */

/**
 * @typedef {Object} CreateRaceResponse
 * @property {string} race - Real race
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 */
/**
 * @typedef {Object} RetrieveRaceResponse
 * @property {string} id - alias id
 * @property {string} race - Real race
 * @property {string} raceToken - Alias created for race
 * @property {string} iv - initialization vector
 * @property {string} authTag - Authentication Tag
 * @property {string} tags - Additional Tags
 * @property {date} createdAt - timestamp alias was created at
 */
/**
 * @typedef {Object} DeleteRaceResponse
 * @property {boolean} ok - If request was successful
 */

/**
 * @fileoverview Nullafi API Client.
 */

const API = require('./services/api');
const CommunicationVault = require('./managers/communication-vault');
const StaticVault = require('./managers/static-vault');

/**
 * Client Class.
*/
module.exports = class Client extends API {
    /**
     * Creates an instance of Client.
     * @memberof Client
     */
    constructor() {
        super();
    }
    /**
     *  Authenticate the Client API
     *
     * @param {string} apiKey
     */
    async authenticate(apiKey) {
        const response = await this.post('/authentication/token', { apiKey });
        this.sessionToken = response.token;
        return response;
    }
    /**
     * Create a new communication vault
     *
     * @param {string} name
     * @param {string[]} tags
     * @return {Promise<any>}
     */
    addCommunicationVault(name, tags) {
        return CommunicationVault.postCommunicationVault(this, name, tags);
    }
    /**
     *  Get a existing communication vault
     *
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<any>}
     */
    getCommunicationVault(vaultId, masterKey) {
        return CommunicationVault.getCommunicationVault(this, vaultId, masterKey);
    }
    /**
         * Create a new static vault
         *
         * @param {string} name
         * @param {string[]} tags
         * @return {Promise<any>}
         */
    addStaticVault(name, tags) {
        return StaticVault.postStaticVault(this, name, tags);
    }
    /**
     *  Get a existing static vault
     *
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<any>}
     */
    getStaticVault(vaultId, masterKey) {
        return CommunicationVault.getStaticVault(this, vaultId, masterKey);
    }
};

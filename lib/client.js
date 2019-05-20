/**
 * @fileoverview Nullafi API Client.
 */

const API = require('./services/api');
const CommunicationVault = require('./managers/communication-vault');
const StaticVault = require('./managers/static-vault');

/**
 * Client Class.
*/
class Client extends API {
    /**
     * Creates an instance of Client.
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
        const response = await this.post('/authentication/alias', { apiKey });
        this.sessionToken = response.alias;
        return response;
    }
    /**
     * Create a new communication vault
     *
     * @param {string} name
     * @param {string[]} tags
     * @return {Promise<CommunicationVault>}
     */
    addCommunicationVault(name, tags) {
        return CommunicationVault.createCommunicationVault(this, name, tags);
    }
    /**
     *  Get a existing communication vault
     *
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<CommunicationVault>}
     */
    retrieveCommunicationVault(vaultId, masterKey) {
        return CommunicationVault.retrieveCommunicationVault(this, vaultId, masterKey);
    }
    /**
         * Create a new static vault
         *
         * @param {string} name
         * @param {string[]} tags
         * @return {Promise<StaticVault>}
         */
    addStaticVault(name, tags) {
        return StaticVault.createStaticVault(this, name, tags);
    }
    /**
     *  Get a existing static vault
     *
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<StaticVault>}
     */
    createStaticVault(vaultId, masterKey) {
        return StaticVault.createStaticVault(this, vaultId, masterKey);
    }
};

module.exports = Client;

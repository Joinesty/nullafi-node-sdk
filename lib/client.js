const API = require('./services/api');
const CommunicationVault = require('./managers/communication-vault/communication-vault');
const StaticVault = require('./managers/static-vault/static-vault');

/**
 * Client Class.
 * @class
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
        const response = await this.post('/authentication/token', { apiKey });
        this.sessionToken = response.token;
        this.tenantId = response.tenantId;
        this.hashKey = response.hashKey;
        return response;
    }
    /**
     * Create a new communication vault
     *
     * @param {string} name
     * @param {string[]} [tags]
     * @return {Promise<CommunicationVaultResponse>}
     */
    createCommunicationVault(name, tags) {
        return CommunicationVault.createCommunicationVault(this, name, tags);
    }
    /**
     *  retrieve an existing communication vault
     *
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<CommunicationVault>}
     */
    retrieveCommunicationVault(vaultId, masterKey) {
        return CommunicationVault.retrieveCommunicationVault(this, vaultId, masterKey);
    }
    /**
     *  delete an existing communication vault
     *
     * @param {string} vaultId
     * @return {Promise}
     */
    deleteCommunicationVault(vaultId) {
        return CommunicationVault.deleteCommunicationVault(this, vaultId);
    }
    /**
         * Create a new static vault
         *
         * @param {string} name
         * @param {string[]} [tags]
         * @return {Promise<StaticVault>}
         */
    createStaticVault(name, tags) {
        return StaticVault.createStaticVault(this, name, tags);
    }
    /**
     *  retrieve an existing static vault
     *
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<StaticVault>}
     */
    retrieveStaticVault(vaultId, masterKey) {
        return StaticVault.retrieveStaticVault(this, vaultId, masterKey);
    }
    /**
    *  delete an existing static vault
    *
    * @param {string} vaultId
    * @param {string} masterKey
    * @return {Promise<StaticVault>}
    */
    deleteStaticVault(vaultId) {
        return StaticVault.deleteStaticVault(this, vaultId);
    }
};

module.exports = Client;

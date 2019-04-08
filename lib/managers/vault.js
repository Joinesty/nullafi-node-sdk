/**
 *
 *
 * @export
 * @class Vault
 */
module.exports = class Vault {
    /**
     *Creates an instance of Vault.
     * @param {Client} client
     * @memberof Vault
     */
    constructor(client) {
        this.client = client;
    }

    /**
     *  Request the API to create a new communication vault
     *
     * @param {string} name
     * @param {string} publicKey
     * @param {string[]} tags
     * @return {Promise<object>}
     * @memberof Vault
     */
    postCommunicationVault(name, publicKey, tags) {
        return this.client.post('/vault/communication', {
            name,
            publicKey,
            tags,
        });
    }

    /**
         *  Request the API to create a new static vault
         *
         * @param {string} name
         * @param {string[]} tags
         * @return {Promise<object>}
         * @memberof Vault
         */
    postStaticVault(name, tags) {
        return this.client.post('/vault/static', {
            name,
            tags,
        });
    }

    /**
     * Get the communication vault from id
     *
     * @param {string} vaultId
     * @return {Promise<any>}
     * @memberof Vault
     */
    getCommunicationVault(vaultId) {
        return this.client.get(`/vault/communication/${vaultId}`);
    }

    /**
         * Get the static vault from id
         *
         * @param {string} vaultId
         * @return {Promise<any>}
         * @memberof Vault
         */
    getStaticVault(vaultId) {
        return this.client.get(`/vault/static/${vaultId}`);
    }
};

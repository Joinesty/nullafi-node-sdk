const Security = require('../services/security');
const Email = require('./email');

/**
 *
 *
 * @export
 * @class Vault
 */
module.exports = class CommunicationVault {
    /**
     *Creates an instance of Vault.
     *
     * @param {Client} client
     * @param {string} vaultId
     * @param {string} name
     * @param {string} masterKey
     * @memberof CommunicationVault
     */
    constructor(client, vaultId, name, masterKey) {
        this.security = new Security();
        this.client = client;
        this.vaultId = vaultId;
        this.name = name;
        this.masterKey = masterKey;

        this.email = new Email(this);
    }

    /**
         * Encrypt static tokens (before sending info to the API)
         *
         * @param {string} value
         * @return {Object}
         */
    encrypt(value) {
        const iv = this._security.aesGenerateInitializationVector();
        return this.security.aesEncrypt(this.masterKey, iv, value);
    }
    /**
         * Encrypt static tokens (before sending info to the API)
         *
         * @param {string} iv
         * @param {string} authTag
         * @param {string} value
         * @return {string}
         */
    decrypt(iv, authTag, value) {
        return this.security.aesDecrypt(this.masterKey, iv, authTag, value);
    }

    /**
     *  Request the API to create a new communication vault
     *
     * @param {Client} client
     * @param {string} name
     * @param {string[]} tags
     * @return {Promise<object>}
     * @memberof CommunicationVault
     */
    static async postCommunicationVault(client, name, tags) {
        const rsaKeys = this.security.rsaGenerateEphemeralKeypairs('test');

        const response = client.post('/vault/communication', {
            name,
            publicKey: rsaKeys.publicKey,
            tags,
        });

        const aesEncryptedMasterKey = this.security.rsaPrivateDecrypt(rsaKeys.privateKey, response.sessionKey);
        const masterKey = this.security.aesDecrypt(response.vaultMasterKey, response.iv, response.authTag, aesEncryptedMasterKey);

        return new CommunicationVault(client, response.id, response.name, masterKey);
    }

    /**
     * Get the communication vault from id
     *
     * @param {Client} client
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<any>}
     * @memberof CommunicationVault
     */
    static async getCommunicationVault(client, vaultId, masterKey) {
        const response = await client.get(`/vault/communication/${vaultId}`);
        return new CommunicationVault(client, vaultId, response.name, masterKey);
    }
};
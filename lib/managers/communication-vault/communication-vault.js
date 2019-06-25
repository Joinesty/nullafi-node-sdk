const Security = require('../../services/security');
const Email = require('../aliases/email/email');

/**
 *
 * @exports CommunicationVault
 * @class
 *
 */
class CommunicationVault {
    /**
     *Creates an instance of Vault.
     * @param {Client} client
     * @param {string} vaultId
     * @param {string} name
     * @param {string} masterKey
     */
    constructor(client, vaultId, name, masterKey) {
        this.security = new Security();
        this.client = client;
        this.id = vaultId;
        this.name = name;
        this.masterKey = masterKey;

        this.email = new Email(this);
    }
    /**
             * Generate a hash for the real data
             *
             * @private
             * @param {string} value
             * @return {string}
             */
    hash(value) {
        return this.security.hmacHash(value, this.client.hashKey);
    }
    /**
         * Encrypt static aliases (before sending info to the API)
         *
         * @private
         * @param {string} value
         * @return {Object}
         */
    encrypt(value) {
        const iv = this.security.aesGenerateInitializationVector();
        return this.security.aesEncrypt(this.masterKey, iv, value);
    }
    /**
         * Decrypt static aliases
         *
         * @private
         * @param {string} iv
         * @param {string} authTag
         * @param {string} value
         * @return {string}
         */
    decrypt(iv, authTag, value) {
        return this.security.aesDecrypt(this.masterKey, iv, authTag, value);
    }

    /**
     *  Create the API to create a new communication vault
     *
     * @param {Client} client
     * @param {string} name
     * @param {string[]} [tags]
     * @return {Promise<CreateCommunicationVaultResponse>}
     */
    static async createCommunicationVault(client, name, tags) {
        const security = new Security();
        const passphrase = security.aesGenerateMasterKey();
        const rsaKeys = await security.rsaGenerateEphemeralKeypairs(passphrase);

        const response = await client.post('/vault/communication', {
            name,
            publicKey: rsaKeys.publicKey,
            tags,
        });

        const aesEncryptedMasterKey = security.rsaPrivateDecrypt({ key: rsaKeys.privateKey, passphrase: passphrase }, response.sessionKey);
        const masterKey = security.aesDecrypt(aesEncryptedMasterKey, response.iv, response.authTag, response.masterKey);

        return new CommunicationVault(client, response.id, response.name, masterKey);
    }

    /**
     * Retrieve the communication vault from id
     *
     * @param {Client} client
     * @param {string} vaultId
     * @param {string} masterKey
     * @return {Promise<RetrieveCommunicationVaultResponse>}
     */
    static async retrieveCommunicationVault(client, vaultId, masterKey) {
        const response = await client.get(`/vault/communication/${vaultId}`);
        return new CommunicationVault(client, vaultId, response.name, masterKey);
    }

    /**
    * Delete the communication vault from id
    *
    * @param {Client} client
    * @param {string} vaultId
    * @return {Promise}
    */
    static async deleteCommunicationVault(client, vaultId) {
        const response = await client.delete(`/vault/communication/${vaultId}`);
        return response;
    }
};

module.exports = CommunicationVault;

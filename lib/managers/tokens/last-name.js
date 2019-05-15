
/**
 *
 *
 * @export
 * @class LastName
 */
class LastName {
    /**
     *Creates an instance of LastName.
     * @param {StaticVault} vault
     * @memberof LastName
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new LastName string to be tokenized for a specific static vault
      *
      * @param {string} lastname
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postLastName(lastname, tags) {
        const result = this.vault.encrypt(lastname);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/lastname`, {
            lastname: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.lastname = this.vault.decrypt(response.iv, response.authTag, response.lastname);
        return response;
    }

    /**
         * Retrieve the LastName string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getLastName(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/lastname/${tokenId}`);
        response.lastname = this.vault.decrypt(response.iv, response.authTag, response.lastname);
        return response;
    }

    /**
         * Delete the LastName token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteLastName(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/lastname/${tokenId}`);
    }
};

module.exports = LastName;


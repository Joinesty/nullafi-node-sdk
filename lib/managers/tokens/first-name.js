
/**
 *
 *
 * @export
 * @class FirstName
 */
class FirstName {
    /**
     *Creates an instance of FirstName.
     * @param {StaticVault} vault
     * @memberof FirstName
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new FirstName string to be tokenized for a specific static vault
      *
      * @param {string} firstname
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postFirstName(firstname, tags) {
        const result = this.vault.encrypt(firstname);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/firstname`, {
            firstname: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        return response;
    }

    /**
         * Retrieve the FirstName string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getFirstName(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/firstname/${tokenId}`);
        response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        return response;
    }

    /**
         * Delete the FirstName token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteFirstName(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/firstname/${tokenId}`);
    }
};

module.exports = FirstName;


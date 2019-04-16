
/**
 *
 *
 * @export
 * @class Name
 */
module.exports = class Name {
    /**
     *Creates an instance of Name.
     * @param {StaticVault} vault
     * @memberof Name
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new Name string to be tokenized for a specific static vault
      *
      * @param {string} name
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postName(name, tags) {
        const result = this.vault.encrypt(name);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/name`, {
            name: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.name = this.vault.decrypt(response.iv, response.authTag, response.name);
        return response;
    }

    /**
         * Retrieve the Name string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getName(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/name/${tokenId}`);
        response.name = this.vault.decrypt(response.iv, response.authTag, response.name);
        return response;
    }

    /**
         * Delete the Name token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteName(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/name/${tokenId}`);
    }
};


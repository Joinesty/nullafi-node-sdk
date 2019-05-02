/**
 *
 *
 * @export
 * @class Generic
 */
module.exports = class Generic {
    /**
     *Creates an instance of Generic.
     * @param {StaticVault} vault
     * @memberof Generic
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
   * Post a new Generic string to be tokenized for a specific static vault
   *
   * @param {string} data
   * @param {string} regexTemplate
   * @param {string[]} tags
   * @return {Promise<any>}
   */
    async postGeneric(data, regexTemplate, tags) {
        const result = this.vault.encrypt(data);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/generic`, {
            data: result.encryptedData,
            template: regexTemplate,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Retrieve the Generic string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getGeneric(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/generic/${tokenId}`);
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Delete the Generic token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteGeneric(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/generic/${tokenId}`);
    }
};

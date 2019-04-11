/**
 *
 *
 * @export
 * @class Random
 */
module.exports = class Random {
    /**
     *Creates an instance of Random.
     * @param {StaticVault} vault
     * @memberof Random
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
   * Post a new Random string to be tokenized for a specific static vault
   *
   * @param {string} data
   * @param {string[]} tags
   * @return {Promise<any>}
   */
    postRandom(data, tags) {
        const result = this.vault.encrypt(data);
        const response = this.vault.client.post(`/vault/static/${this.vault.id}/random`, {
            data: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Retrieve the Random string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getRandom(tokenId) {
        const response = this.vault.client.get(`/vault/static/${this.vault.id}/random/${tokenId}`);
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Delete the Random token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteRandom(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/random/${tokenId}`);
    }
};

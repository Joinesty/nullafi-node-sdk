/**
 *
 * @exports Random
 *
 */
class Random {
    /**
     *Creates an instance of Random.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
   * Create a new Random string to be aliased for a specific static vault
   *
   * @param {string} data
   * @param {string[]} tags
   * @return {Promise<any>}
   */
    async createRandom(data, tags) {
        const result = this.vault.encrypt(data);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/random`, {
            data: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Retrieve the Random string alias from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrieveRandom(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/random/${tokenId}`);
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Delete the Random alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteRandom(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/random/${tokenId}`);
    }
};

module.exports = Random;

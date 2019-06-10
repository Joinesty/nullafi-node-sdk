/**
 *
 * @exports Random
 * @class
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
   * <pre><code>
        * //example call:
        * const randomAliasObj = await staticVault.race.createRandom
        * ('random value', ['my-race-tag1', 'my-race-tag2']);
        * </pre></code>
   *
   * @param {string} data Data to alias
   * @param {string[]} [tags] Strings to categorize alias
   * @return {Promise<CreateRandomResponse>}
   */
    async createRandom(data, tags) {
        const result = this.vault.encrypt(data);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/random`, {
            data: result.encryptedData,
            dataHash: this.vault.hash(data),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Retrieve the Random string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveRandomResponse>}
         */
    async retrieveRandom(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/random/${aliasId}`);
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
        * Retrieve the Random string alias from real random.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} random Real value
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveRandomResponse[]>}
        */
    async retrieveRandomFromRealData(random, tags) {
        const query = {
            hash: this.vault.hash(random),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/random', query);
        responseList.forEach((response) => {
            response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        });
        return responseList;
    }

    /**
         * Delete the Random alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteRandomResponse>}
         */
    deleteRandom(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/random/${aliasId}`);
    }
};

module.exports = Random;

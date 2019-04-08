/**
 *
 *
 * @export
 * @class Random
 */
module.exports = class Random {
    /**
     *Creates an instance of Random.
     * @param {*} client
     * @memberof Random
     */
    constructor(client) {
        this.client = client;
    }
    /**
   * Post a new Random string to be tokenized for a specific static vault
   *
   * @param {string} vaultId
   * @param {string} data
   * @param {string[]} tags
   * @return {Promise<any>}
   */
    postRandom(vaultId, data, tags) {
        return this.client.post(`/vault/static/${vaultId}/random`, {
            data,
            tags,
        });
    }

    /**
         * Retrieve the Random string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getRandom(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/random/${tokenId}`);
    }

    /**
         * Delete the Random token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteRandom(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/random/${tokenId}`);
    }
};

/**
 *
 *
 * @export
 * @class Race
 */
module.exports = class Race {
    /**
     *Creates an instance of Race.
     * @param {*} client
     * @memberof Race
     */
    constructor(client) {
        this.client = client;
    }
    /**
      * Post a new Race string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} race
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postRace(vaultId, race, tags) {
        return this.client.post(`/vault/static/${vaultId}/race`, {
            race,
            tags,
        });
    }

    /**
         * Retrieve the Race string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getRace(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/race/${tokenId}`);
    }

    /**
         * Delete the Race token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteRace(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/race/${tokenId}`);
    }
};


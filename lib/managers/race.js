/**
 *
 *
 * @export
 * @class Race
 */
module.exports = class Race {
    /**
     *Creates an instance of Race.
     * @param {StaticVault} vault
     * @memberof Race
     */
    constructor(vault) {
        this.vault = vault;
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
        const result = this.vault.encrypt(race);
        const response = this.vault.client.post(`/vault/static/${vaultId}/race`, {
            race: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        return response;
    }

    /**
         * Retrieve the Race string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getRace(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/race/${tokenId}`);
        response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        return response;
    }

    /**
         * Delete the Race token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteRace(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/race/${tokenId}`);
    }
};


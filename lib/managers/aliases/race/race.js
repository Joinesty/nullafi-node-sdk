/**
 *
 * @exports Race
 * @class
 *
 */
class Race {
    /**
     *Creates an instance of Race.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Race string to be aliased for a specific static vault
      *
      * @param {string} race
      * @param {string[]} tags
      * @return {Promise<CreateRaceResponse>}
      */
    async createRace(race, tags) {
        const result = this.vault.encrypt(race);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/race`, {
            race: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        return response;
    }

    /**
         * Retrieve the Race string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveRaceResponse>}
         */
    async retrieveRace(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/race/${aliasId}`);
        response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        return response;
    }

    /**
         * Delete the Race alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteRaceResponse>}
         */
    deleteRace(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/race/${aliasId}`);
    }
};

module.exports = Race;


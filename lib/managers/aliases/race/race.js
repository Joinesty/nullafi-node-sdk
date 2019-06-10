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
      * <pre><code>
        * //example call:
        * const raceAliasObj = await staticVault.race.createRace
        * ('Native Hawaiian or Other Pacific Islander', ['my-race-tag1', 'my-race-tag2']);
        * Output options are:
        * "American Indian or Alaska Native",
        * "Asian",
        * "Black or African American",
        * "Native Hawaiian or Other Pacific Islander",
        * "White",
        * "Other",
        * "Hispanic or Latino"
        * </pre></code>
      *
      * @param {string} race race to alias
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateRaceResponse>}
      */
    async createRace(race, tags) {
        const result = this.vault.encrypt(race);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/race`, {
            race: result.encryptedData,
            raceHash: this.vault.hash(race),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        return response;
    }

    /**
         * Retrieve the Race string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveRaceResponse>}
         */
    async retrieveRace(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/race/${aliasId}`);
        response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        return response;
    }

    /**
            * Retrieve the Race string alias from real race.
            * Real value must be an exact match and will also be case sensitive.
            * Returns an array of matching values. Array will be sorted by date created.
            *
            * @param {string} race Real race
            * @param {string[]} [tags] Strings used to filter return results
            * @return {Promise<RetrieveRaceResponse[]>}
            */
    async retrieveRaceFromRealData(race, tags) {
        const query = {
            hash: this.vault.hash(race),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/race', query);
        responseList.forEach((response) => {
            response.race = this.vault.decrypt(response.iv, response.authTag, response.race);
        });
        return responseList;
    }

    /**
         * Delete the Race alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteRaceResponse>}
         */
    deleteRace(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/race/${aliasId}`);
    }
};

module.exports = Race;


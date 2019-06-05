/**
 *
 * @exports PlaceOfBirth
 * @class
 *
 */
class PlaceOfBirth {
    /**
     *Creates an instance of PlaceOfBirth.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new PlaceOfBirth string to be aliased for a specific static vault
      *
      * @param {string} placeofbirth Place of birth to alias
      * @param {string} [state] State to generate
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreatePlaceOfBirthResponse>}
      */
    async createPlaceOfBirth(placeofbirth, state, tags) {
        const result = this.vault.encrypt(placeofbirth);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/placeofbirth${state ? `/${state}` : ''}`, {
            placeofbirth: result.encryptedData,
            placeofbirthHash: this.vault.hash(placeofbirth),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Retrieve the PlaceOfBirth string alias from a static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrievePlaceOfBirthResponse>}
         */
    async retrievePlaceOfBirth(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
        * Retrieve the PlaceOfBirth string alias from real placeofbirth
        *
        * @param {string} placeofbirth Real placeofbirth
        * @param {string[]} [tags] Strings associated with alias
        * @return {Promise<RetrievePlaceOfBirthResponse[]>}
        */
    async retrievePlaceOfBirthFromRealData(placeofbirth, tags) {
        const query = {
            hash: this.vault.hash(placeofbirth),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/placeofbirth', query);
        responseList.forEach((response) => {
            response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        });
        return responseList;
    }

    /**
         * Delete the PlaceOfBirth alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeletePlaceOfBirthResponse>}
         */
    deletePlaceOfBirth(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
    }
};

module.exports = PlaceOfBirth;


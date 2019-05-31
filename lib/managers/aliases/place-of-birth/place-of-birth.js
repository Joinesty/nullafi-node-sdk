/**
 *
 * @exports PlaceOfBirth
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
      * @param {string} placeofbirth
      * @param {string[]} tags
      * @param {string} state
      * @return {Promise<CreatePlaceOfBirthResponse>}
      */
    async createPlaceOfBirth(placeofbirth, tags, state) {
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
         * @param {string} aliasId
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
        * @param {string} placeofbirth
        * @param {string[]} tags
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
         * @param {string} aliasId
         * @return {Promise<DeletePlaceOfBirthResponse>}
         */
    deletePlaceOfBirth(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
    }
};

module.exports = PlaceOfBirth;


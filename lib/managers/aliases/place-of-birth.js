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
      * @return {Promise<any>}
      */
    async createPlaceOfBirth(placeofbirth, tags) {
        const result = this.vault.encrypt(placeofbirth);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/placeofbirth`, {
            placeofbirth: result.encryptedData,
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
         * @return {Promise<any>}
         */
    async retrievePlaceOfBirth(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Delete the PlaceOfBirth alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<any>}
         */
    deletePlaceOfBirth(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
    }
};

module.exports = PlaceOfBirth;


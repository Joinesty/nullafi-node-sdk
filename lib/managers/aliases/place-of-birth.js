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
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrievePlaceOfBirth(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/placeofbirth/${tokenId}`);
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Delete the PlaceOfBirth alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePlaceOfBirth(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/placeofbirth/${tokenId}`);
    }
};

module.exports = PlaceOfBirth;


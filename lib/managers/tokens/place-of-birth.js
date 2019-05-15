
/**
 *
 *
 * @export
 * @class PlaceOfBirth
 */
class PlaceOfBirth {
    /**
     *Creates an instance of PlaceOfBirth.
     * @param {StaticVault} vault
     * @memberof PlaceOfBirth
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new PlaceOfBirth string to be tokenized for a specific static vault
      *
      * @param {string} placeofbirth
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postPlaceOfBirth(placeofbirth, tags) {
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
         * Retrieve the PlaceOfBirth string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getPlaceOfBirth(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/placeofbirth/${tokenId}`);
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Delete the PlaceOfBirth token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePlaceOfBirth(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/placeofbirth/${tokenId}`);
    }
};

module.exports = PlaceOfBirth;



/**
 *
 *
 * @export
 * @class PlaceOfBirth
 */
module.exports = class PlaceOfBirth {
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
      * @param {string} vaultId
      * @param {string} placeofbirth
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postPlaceOfBirth(vaultId, placeofbirth, tags) {
        const result = this.vault.encrypt(placeofbirth);
        const response = this.vault.client.post(`/vault/static/${vaultId}/placeofbirth`, {
            placeofbirth: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Retrieve the PlaceOfBirth string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getPlaceOfBirth(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/placeofbirth/${tokenId}`);
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Delete the PlaceOfBirth token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePlaceOfBirth(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/placeofbirth/${tokenId}`);
    }
};


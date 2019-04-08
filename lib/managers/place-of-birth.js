
/**
 *
 *
 * @export
 * @class PlaceOfBirth
 */
module.exports = class PlaceOfBirth {
    /**
     *Creates an instance of PlaceOfBirth.
     * @param {*} client
     * @memberof PlaceOfBirth
     */
    constructor(client) {
        this.client = client;
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
        return this.client.post(`/vault/static/${vaultId}/placeofbirth`, {
            placeofbirth,
            tags,
        });
    }

    /**
         * Retrieve the PlaceOfBirth string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getPlaceOfBirth(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/placeofbirth/${tokenId}`);
    }

    /**
         * Delete the PlaceOfBirth token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePlaceOfBirth(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/placeofbirth/${tokenId}`);
    }
};


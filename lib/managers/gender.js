
/**
 *
 *
 * @export
 * @class Gender
 */
module.exports = class Gender {
    /**
     *Creates an instance of Gender.
     * @param {*} client
     * @memberof Gender
     */
    constructor(client) {
        this.client = client;
    }
    /**
      * Post a new Gender string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} gender
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postGender(vaultId, gender, tags) {
        return this.client.post(`/vault/static/${vaultId}/gender`, {
            gender,
            tags,
        });
    }

    /**
         * Retrieve the Gender string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getGender(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/gender/${tokenId}`);
    }

    /**
         * Delete the Gender token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteGender(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/gender/${tokenId}`);
    }
};


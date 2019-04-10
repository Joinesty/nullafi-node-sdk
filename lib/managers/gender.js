
/**
 *
 *
 * @export
 * @class Gender
 */
module.exports = class Gender {
    /**
     *Creates an instance of Gender.
     * @param {StaticVault} vault
     * @memberof Gender
     */
    constructor(vault) {
        this.vault = vault;
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
        const result = this.vault.encrypt(gender);
        const response = this.vault.client.post(`/vault/static/${vaultId}/gender`, {
            gender: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Retrieve the Gender string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getGender(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/gender/${tokenId}`);
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Delete the Gender token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteGender(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/gender/${tokenId}`);
    }
};


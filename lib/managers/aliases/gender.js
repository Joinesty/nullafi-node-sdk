/**
 *
 * @exports Gender
 *
 */
class Gender {
    /**
     *Creates an instance of Gender.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Gender string to be aliased for a specific static vault
      *
      * @param {string} gender
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async createGender(gender, tags) {
        const result = this.vault.encrypt(gender);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/gender`, {
            gender: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Retrieve the Gender string alias from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrieveGender(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/gender/${tokenId}`);
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Delete the Gender alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteGender(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/gender/${tokenId}`);
    }
};

module.exports = Gender;



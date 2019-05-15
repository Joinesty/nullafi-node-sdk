
/**
 *
 *
 * @export
 * @class Gender
 */
class Gender {
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
      * @param {string} gender
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postGender(gender, tags) {
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
         * Retrieve the Gender string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getGender(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/gender/${tokenId}`);
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Delete the Gender token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteGender(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/gender/${tokenId}`);
    }
};

module.exports = Gender;



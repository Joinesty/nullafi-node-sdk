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
      * @return {Promise<CreateGenderResponse>}
      */
    async createGender(gender, tags) {
        const result = this.vault.encrypt(gender);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/gender`, {
            gender: result.encryptedData,
            genderHash: this.vault.hash(gender),
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
         * @param {string} aliasId
         * @return {Promise<RetrieveGenderResponse>}
         */
    async retrieveGender(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/gender/${aliasId}`);
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Delete the Gender alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteGenderResponse>}
         */
    deleteGender(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/gender/${aliasId}`);
    }
};

module.exports = Gender;



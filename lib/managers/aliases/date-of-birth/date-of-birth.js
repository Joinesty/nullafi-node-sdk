/**
 *
 * @exports DateOfBirth
 *
 */
class DateOfBirth {
    /**
     *Creates an instance of DateOfBirth.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new DateOfBirth string to be aliased for a specific static vault
      *
      * @param {string} dateofbirth
      * @param {string[]} tags
      * @return {Promise<CreateDateOfBirthResponse>}
      */
    async createDateOfBirth(dateofbirth, tags) {
        const result = this.vault.encrypt(dateofbirth);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/dateofbirth`, {
            dateofbirth: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }
    /**
         * Retrieve the DateOfBirth string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveDateOfBirthResponse>}
         */
    async retrieveDateOfBirth(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/dateofbirth/${aliasId}`);
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }

    /**
         * Delete the DateOfBirth alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteDateOfBirthResponse>}
         */
    deleteDateOfBirth(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/dateofbirth/${aliasId}`);
    }
};

module.exports = DateOfBirth;

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
      * @return {Promise<any>}
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
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrieveDateOfBirth(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/dateofbirth/${tokenId}`);
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }

    /**
         * Delete the DateOfBirth alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDateOfBirth(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/dateofbirth/${tokenId}`);
    }
};

module.exports = DateOfBirth;


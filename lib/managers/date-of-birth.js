/**
 *
 *
 * @export
 * @class DateOfBirth
 */
module.exports = class DateOfBirth {
    /**
     *Creates an instance of DateOfBirth.
     * @param {StaticVault} vault
     * @memberof DateOfBirth
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new DateOfBirth string to be tokenized for a specific static vault
      *
      * @param {string} dateofbirth
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postDateOfBirth(dateofbirth, tags) {
        const result = this.vault.encrypt(dateofbirth);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/dateofbirth`, {
            dateofbirth: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.addressToken);
        return response;
    }
    /**
         * Retrieve the DateOfBirth string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getDateOfBirth(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/dateofbirth/${tokenId}`);
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }

    /**
         * Delete the DateOfBirth token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDateOfBirth(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/dateofbirth/${tokenId}`);
    }
};


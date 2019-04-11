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
      * @param {string} vaultId
      * @param {string} dateofbirth
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postDateOfBirth(vaultId, dateofbirth, tags) {
        const result = this.vault.encrypt(dateofbirth);
        const response = this.vault.client.post(`/vault/static/${vaultId}/dateofbirth`, {
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
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getDateOfBirth(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/dateofbirth/${tokenId}`);
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }

    /**
         * Delete the DateOfBirth token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDateOfBirth(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/dateofbirth/${tokenId}`);
    }
};


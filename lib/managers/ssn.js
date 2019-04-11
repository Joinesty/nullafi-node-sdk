
/**
 *
 *
 * @export
 * @class SSN
 */
module.exports = class SSN {
    /**
     *Creates an instance of SSN.
     * @param {StaticVault} vault
     * @memberof SSN
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new SSN string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} ssn
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postSSN(vaultId, ssn, tags) {
        const result = this.vault.encrypt(ssn);
        const response = this.vault.client.post(`/vault/static/${vaultId}/ssn`, {
            ssn: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.ssn = this.vault.decrypt(response.iv, response.authTag, response.ssn);
        return response;
    }

    /**
         * Retrieve the SSN string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getSSN(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/ssn/${tokenId}`);
        response.ssn = this.vault.decrypt(response.iv, response.authTag, response.ssn);
        return response;
    }

    /**
         * Delete the SSN token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteSSN(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/ssn/${tokenId}`);
    }
};

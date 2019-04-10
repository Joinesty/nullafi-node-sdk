/**
 *
 *
 * @export
 * @class Passport
 */
module.exports = class Passport {
    /**
     *Creates an instance of Passport.
     * @param {StaticVault} vault
     * @memberof Passport
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new Passport string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} passport
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postPassport(vaultId, passport, tags) {
        const result = this.vault.encrypt(passport);
        const response = this.vault.client.post(`/vault/static/${vaultId}/passport`, {
            passport: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
         * Retrieve the Passport string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getPassport(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/passport/${tokenId}`);
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
         * Delete the Passport token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePassport(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/passport/${tokenId}`);
    }
};

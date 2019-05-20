/**
 *
 * @exports Passport
 *
 */
class Passport {
    /**
     *Creates an instance of Passport.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Passport string to be aliased for a specific static vault
      *
      * @param {string} passport
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async createPassport(passport, tags) {
        const result = this.vault.encrypt(passport);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/passport`, {
            passport: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
         * Retrieve the Passport string alias from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrievePassport(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/passport/${tokenId}`);
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
         * Delete the Passport alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePassport(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/passport/${tokenId}`);
    }
};

module.exports = Passport;

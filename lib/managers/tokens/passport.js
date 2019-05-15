/**
 *
 *
 * @export
 * @class Passport
 */
class Passport {
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
      * @param {string} passport
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async postPassport(passport, tags) {
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
         * Retrieve the Passport string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getPassport(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/passport/${tokenId}`);
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
         * Delete the Passport token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePassport(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/passport/${tokenId}`);
    }
};

module.exports = Passport;

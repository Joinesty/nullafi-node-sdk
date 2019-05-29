/**
 *
 * @exports Passport
 * @class
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
      * @return {Promise<CreatePassportResponse>}
      */
    async createPassport(passport, tags) {
        const result = this.vault.encrypt(passport);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/passport`, {
            passport: result.encryptedData,
            passportHash: this.vault.hash(passport),
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
         * @param {string} aliasId
         * @return {Promise<RetrievePassportResponse>}
         */
    async retrievePassport(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/passport/${aliasId}`);
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
        * Retrieve the Passport string alias from real passport
        *
        * @param {string} passport
        * @param {string[]} tags
        * @return {Promise<RetrievePassportResponse[]>}
        */
    async retrievePassportFromRealData(passport, tags) {
        const query = {
            hash: this.vault.hash(passport),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/passport', query);
        responseList.forEach((response) => {
            response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        });
        return responseList;
    }

    /**
         * Delete the Passport alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeletePassportResponse>}
         */
    deletePassport(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/passport/${aliasId}`);
    }
};

module.exports = Passport;

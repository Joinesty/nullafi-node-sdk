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
      * <pre><code>
        * //example call:
        * const passportAliasObj = await staticVault.passport.createPassport('123456789', ['my-passport-tag1', 'my-passport-tag2']);
        * </pre></code>
      *
      * @param {string} passport Passport to alias
      * @param {string[]} [tags] Strings to categorize alias
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
         * Retrieve the Passport string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrievePassportResponse>}
         */
    async retrievePassport(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/passport/${aliasId}`);
        response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        return response;
    }

    /**
        * Retrieve the Passport string alias from real passport.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} passport Real passport
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrievePassportResponse[]>}
        */
    async retrievePassportFromRealData(passport, tags) {
        const query = {
            hash: this.vault.hash(passport),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/passport`, query);
        responseList.forEach((response) => {
            response.passport = this.vault.decrypt(response.iv, response.authTag, response.passport);
        });
        return responseList;
    }

    /**
         * Delete the Passport alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeletePassportResponse>}
         */
    deletePassport(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/passport/${aliasId}`);
    }
};

module.exports = Passport;

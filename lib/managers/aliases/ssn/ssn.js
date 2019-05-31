/**
 *
 * @exports SSN
 * @class
 *
 */
class SSN {
    /**
     *Creates an instance of SSN.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new SSN string to be aliased for a specific static vault
      *
      * @param {string} ssn
      * @param {string[]} tags
      * @param {string} state
      * @return {Promise<CreateSsnResponse>}
      */
    async createSSN(ssn, tags, state) {
        const result = this.vault.encrypt(ssn);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/ssn${state ? `/${state}` : ''}`, {
            ssn: result.encryptedData,
            ssnHash: this.vault.hash(ssn),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.ssn = this.vault.decrypt(response.iv, response.authTag, response.ssn);
        return response;
    }

    /**
         * Retrieve the SSN string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveSsnResponse>}
         */
    async retrieveSSN(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/ssn/${aliasId}`);
        response.ssn = this.vault.decrypt(response.iv, response.authTag, response.ssn);
        return response;
    }

    /**
        * Retrieve the SSN string alias from real ssn
        *
        * @param {string} ssn
        * @param {string[]} tags
        * @return {Promise<RetrieveSSNResponse[]>}
        */
    async retrieveSSNFromRealData(ssn, tags) {
        const query = {
            hash: this.vault.hash(ssn),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/ssn', query);
        responseList.forEach((response) => {
            response.ssn = this.vault.decrypt(response.iv, response.authTag, response.ssn);
        });
        return responseList;
    }

    /**
         * Delete the SSN alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteSsnResponse>}
         */
    deleteSSN(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/ssn/${aliasId}`);
    }
};

module.exports = SSN;

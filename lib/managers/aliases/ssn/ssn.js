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
      *<pre><code>
        * Output format:
        * ###-##-####
        * //example call
        * const ssnAliasObj = await staticVault.ssn.createSSN
        * ('123-45-6789', ['my-ssn-tag1', 'my-ssn-tag2']);
        * </pre></code>
      *
      * @param {string} ssn SSN to alias
      * @param {string} [state] State to generate
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateSsnResponse>}
      */
    async createSSN(ssn, state, tags) {
        if (arguments.length === 2) {
            if (Object.prototype.toString.call(state) === '[object Array]') {
                tags = state;
                state = null;
            }
        }
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
         * Retrieve the SSN string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveSsnResponse>}
         */
    async retrieveSSN(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/ssn/${aliasId}`);
        response.ssn = this.vault.decrypt(response.iv, response.authTag, response.ssn);
        return response;
    }

    /**
        * Retrieve the SSN string alias from real SSN.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} ssn Real SSN
        * @param {string[]} [tags] Strings used to filter return results
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
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteSsnResponse>}
         */
    deleteSSN(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/ssn/${aliasId}`);
    }
};

module.exports = SSN;

/**
 *
 * @exports TaxPayer
 * @class
 *
 */
class TaxPayer {
    /**
     *Creates an instance of TaxPayer.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
          * Create a new TaxPayer string to be aliased for a specific static vault
          * <pre><code>
            * Output format:
            * 9#-##-####
            * //example call
            * const taxPayerIDAliasObj = await staticVault.taxPayerID.createTaxPayer
            * ('92-45-6789', ['my-taxPayerID-tag1', 'my-taxPayerID-tag2']);
            * </pre></code>
          *
          * @param {string} taxpayer Tax payer ID to alias
          * @param {string[]} [tags] Strings to categorize alias
          * @return {Promise<CreateTaxPayerResponse>}
          */
    async createTaxPayer(taxpayer, tags) {
        const result = this.vault.encrypt(taxpayer);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/taxpayer`, {
            taxpayer: result.encryptedData,
            taxpayerHash: this.vault.hash(taxpayer),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.taxpayer = this.vault.decrypt(response.iv, response.authTag, response.taxpayer);
        return response;
    }

    /**
         * Retrieve the TaxPayer string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveTaxPayerResponse>}
         */
    async retrieveTaxPayer(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/taxpayer/${aliasId}`);
        response.taxpayer = this.vault.decrypt(response.iv, response.authTag, response.taxpayer);
        return response;
    }

    /**
        * Retrieve the TaxPayer string alias from real taxpayer.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} taxpayer Real taxpayer
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveTaxPayerResponse[]>}
        */
    async retrieveTaxPayerFromRealData(taxpayer, tags) {
        const query = {
            hash: this.vault.hash(taxpayer),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/taxpayer`, query);
        responseList.forEach((response) => {
            response.taxpayer = this.vault.decrypt(response.iv, response.authTag, response.taxpayer);
        });
        return responseList;
    }

    /**
         * Delete the TaxPayer alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteTaxPayerResponse>}
         */
    deleteTaxPayer(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/taxpayer/${aliasId}`);
    }
};

module.exports = TaxPayer;


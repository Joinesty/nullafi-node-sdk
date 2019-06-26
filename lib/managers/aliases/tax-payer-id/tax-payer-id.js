/**
 *
 * @exports TaxPayerID
 * @class
 *
 */
class TaxPayerID {
    /**
     *Creates an instance of TaxPayerID.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
          * Create a new TaxPayerID string to be aliased for a specific static vault
          * <pre><code>
            * Output format:
            * 9#-##-####
            * //example call
            * const taxPayerIDAliasObj = await staticVault.taxPayerID.createTaxPayerID
            * ('92-45-6789', ['my-taxPayerID-tag1', 'my-taxPayerID-tag2']);
            * </pre></code>
          *
          * @param {string} taxpayerid Tax payer ID to alias
          * @param {string[]} [tags] Strings to categorize alias
          * @return {Promise<CreateTaxPayerIDResponse>}
          */
    async createTaxPayerID(taxpayerid, tags) {
        const result = this.vault.encrypt(taxpayerid);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/taxpayerid`, {
            taxpayerid: result.encryptedData,
            taxpayeridHash: this.vault.hash(taxpayerid),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.taxpayerid = this.vault.decrypt(response.iv, response.authTag, response.taxpayerid);
        return response;
    }

    /**
         * Retrieve the TaxPayerID string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveTaxPayerIDResponse>}
         */
    async retrieveTaxPayerID(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/taxpayerid/${aliasId}`);
        response.taxpayerid = this.vault.decrypt(response.iv, response.authTag, response.taxpayerid);
        return response;
    }

    /**
        * Retrieve the TaxPayerID string alias from real taxpayerid.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} taxpayerid Real taxpayerid
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveTaxPayerIDResponse[]>}
        */
    async retrieveTaxPayerIDFromRealData(taxpayerid, tags) {
        const query = {
            hash: this.vault.hash(taxpayerid),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/taxpayerid`, query);
        responseList.forEach((response) => {
            response.taxpayerid = this.vault.decrypt(response.iv, response.authTag, response.taxpayerid);
        });
        return responseList;
    }

    /**
         * Delete the TaxPayerID alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteTaxPayerIDResponse>}
         */
    deleteTaxPayerID(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/taxpayerid/${aliasId}`);
    }
};

module.exports = TaxPayerID;


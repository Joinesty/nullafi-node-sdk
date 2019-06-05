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
         * Retrieve the TaxPayerID string alias from a static vault
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
        * Retrieve the TaxPayerID string alias from real taxpayerid
        *
        * @param {string} taxpayerid Real taxpayerid
        * @param {string[]} [tags] Strings associated with alias
        * @return {Promise<RetrieveTaxPayerIDResponse[]>}
        */
    async retrieveTaxPayerIDFromRealData(taxpayerid, tags) {
        const query = {
            hash: this.vault.hash(taxpayerid),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/taxpayerid', query);
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


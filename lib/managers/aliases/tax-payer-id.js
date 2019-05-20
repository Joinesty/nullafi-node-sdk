/**
 *
 * @exports TaxPayerID
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
          * @param {string} taxpayerid
          * @param {string[]} tags
          * @return {Promise<any>}
          */
    async createTaxPayerID(taxpayerid, tags) {
        const result = this.vault.encrypt(taxpayerid);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/taxpayerid`, {
            taxpayerid: result.encryptedData,
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
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrieveTaxPayerID(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/taxpayerid/${tokenId}`);
        response.taxpayerid = this.vault.decrypt(response.iv, response.authTag, response.taxpayerid);
        return response;
    }

    /**
         * Delete the TaxPayerID alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteTaxPayerID(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/taxpayerid/${tokenId}`);
    }
};

module.exports = TaxPayerID;

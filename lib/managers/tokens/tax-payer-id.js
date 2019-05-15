/**
 *
 *
 * @export
 * @class TaxPayerID
 */
class TaxPayerID {
    /**
     *Creates an instance of TaxPayerID.
     * @param {StaticVault} vault
     * @memberof TaxPayerID
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
          * Post a new TaxPayerID string to be tokenized for a specific static vault
          *
          * @param {string} taxpayerid
          * @param {string[]} tags
          * @return {Promise<any>}
          */
    async postTaxPayerID(taxpayerid, tags) {
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
         * Retrieve the TaxPayerID string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getTaxPayerID(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/taxpayerid/${tokenId}`);
        response.taxpayerid = this.vault.decrypt(response.iv, response.authTag, response.taxpayerid);
        return response;
    }

    /**
         * Delete the TaxPayerID token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteTaxPayerID(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/taxpayerid/${tokenId}`);
    }
};

module.exports = TaxPayerID;


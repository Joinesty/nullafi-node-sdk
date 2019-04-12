/**
 *
 *
 * @export
 * @class TaxPayerID
 */
module.exports = class TaxPayerID {
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
    postTaxPayerID(taxpayerid, tags) {
        const result = this.vault.encrypt(taxpayerid);
        const response = this.vault.client.post(`/vault/static/${this.vault.id}/taxpayerid`, {
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
    getTaxPayerID(tokenId) {
        return this.vault.client.get(`/vault/static/${this.vault.id}/taxpayerid/${tokenId}`);
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


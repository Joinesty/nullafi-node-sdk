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
          * @param {string} vaultId
          * @param {string} taxpayerid
          * @param {string[]} tags
          * @return {Promise<any>}
          */
    postTaxPayerID(vaultId, taxpayerid, tags) {
        const result = this.vault.encrypt(taxpayerid);
        const response = this.vault.client.post(`/vault/static/${vaultId}/taxpayerid`, {
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
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getTaxPayerID(vaultId, tokenId) {
        return this.vault.client.get(`/vault/static/${vaultId}/taxpayerid/${tokenId}`);
    }

    /**
         * Delete the TaxPayerID token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteTaxPayerID(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/taxpayerid/${tokenId}`);
    }
};


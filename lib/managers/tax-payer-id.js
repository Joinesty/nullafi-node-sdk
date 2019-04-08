/**
 *
 *
 * @export
 * @class TaxPayerID
 */
module.exports = class TaxPayerID {
    /**
     *Creates an instance of TaxPayerID.
     * @param {*} client
     * @memberof TaxPayerID
     */
    constructor(client) {
        this.client = client;
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
        return this.client.post(`/vault/static/${vaultId}/taxpayerid`, {
            taxpayerid,
            tags,
        });
    }

    /**
         * Retrieve the TaxPayerID string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getTaxPayerID(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/taxpayerid/${tokenId}`);
    }

    /**
         * Delete the TaxPayerID token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteTaxPayerID(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/taxpayerid/${tokenId}`);
    }
};


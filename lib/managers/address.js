
/**
 *
 *
 * @export
 * @class Address
 */
module.exports = class Address {
    /**
     *Creates an instance of Address.
     * @param {*} client
     * @memberof Address
     */
    constructor(client) {
        this.client = client;
    }
    /**
      * Post a new Address string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} address
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postAddress(vaultId, address, tags) {
        return this.client.post(`/vault/static/${vaultId}/address`, {
            address,
            tags,
        });
    }

    /**
         * Retrieve the Address string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getAddress(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/address/${tokenId}`);
    }

    /**
         * Delete the Address token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteAddress(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/address/${tokenId}`);
    }
};



/**
 *
 *
 * @export
 * @class Address
 */
module.exports = class Address {
    /**
     *Creates an instance of Address.
     * @param {StaticVault} vault
     * @memberof Address
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new Address string to be tokenized for a specific static vault
      *
      * @param {string} address
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postAddress(address, tags) {
        const result = this.vault.encrypt(address);
        const response = this.vault.client.post(`/vault/static/${this.vault.id}/address`, {
            address: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        return response;
    }

    /**
         * Retrieve the Address string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getAddress(tokenId) {
        const response = this.vault.client.get(`/vault/static/${this.vault.id}/address/${tokenId}`);
        response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        return response;
    }

    /**
         * Delete the Address token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteAddress(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/address/${tokenId}`);
    }
};


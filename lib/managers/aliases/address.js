/**
 *
 * @exports Address
 *
 */
class Address {
    /**
     *Creates an instance of Address.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Address string to be aliased for a specific static vault
      *
      * @param {string} address
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async createAddress(address, tags) {
        const result = this.vault.encrypt(address);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/address`, {
            address: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        return response;
    }

    /**
         * Retrieve the Address string alias from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrieveAddress(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/address/${tokenId}`);
        response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        return response;
    }

    /**
         * Delete the Address alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteAddress(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/address/${tokenId}`);
    }
};

module.exports = Address;


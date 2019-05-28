/**
 *
 * @exports Address
 * @class Address
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
      * @return {Promise<CreateAddressResponse>}
      */
    async createAddress(address, tags) {
        const result = this.vault.encrypt(address);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/address`, {
            address: result.encryptedData,
            addressHash: this.vault.hash(address),
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
         * @param {string} aliasId
         * @return {Promise<RetrieveAddressResponse>}
         */
    async retrieveAddress(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/address/${aliasId}`);
        response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        return response;
    }

    /**
         * Delete the Address alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteAddressResponse>}
         */
    deleteAddress(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/address/${aliasId}`);
    }
};

module.exports = Address;


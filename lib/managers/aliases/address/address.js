/**
 *
 * @exports Address
 * @class
 *
 */
class Address {
    /**
     *Creates an instance of Address.
     * @param {StaticVault} vault Vault to store aliases
     */
    constructor(vault) {
        this.vault = vault;
    }

    /**
      * Create a new Address string to be aliased for a specific static vault
      * <pre><code>
        * street, city, state abbreviation zipcode, USA
        * 43520 Hills Flat, East Aricchester, AK 99761, USA

        * //example call
        * const addressAliasObj = await staticVault.address.createAddress
        * ('138 Congress St, Portland, ME 04101', 'ME' ['my-address-tag1', 'my-address-tag2']);
      * </pre></code>
      *
      * @param {string} address Real address to alias
      * @param {string} [state] US state abbreviations
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateAddressResponse>}
      */
    async createAddress(address, state, tags) {
        if (arguments.length === 2) {
            if (Object.prototype.toString.call(state) === '[object Array]') {
                tags = state;
                state = null;
            }
        }
        const result = this.vault.encrypt(address);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/address${state ? `/${state}` : ''}`, {
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
         * Retrieve the Address string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve ID of the alias to retrieve
         * @return {Promise<RetrieveAddressResponse>}
         */
    async retrieveAddress(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/address/${aliasId}`);
        response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        return response;
    }

    /**
         * Retrieve the Address string alias from real address.
         * Real value must be an exact match and will also be case sensitive.
         * Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} address Real address
         * @param {string[]} [tags] Strings used to filter return results
         * @return {Promise<RetrieveAddressResponse[]>}
         */
    async retrieveAddressFromRealData(address, tags) {
        const query = {
            hash: this.vault.hash(address),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/address', query);
        responseList.forEach((response) => {
            response.address = this.vault.decrypt(response.iv, response.authTag, response.address);
        });
        return responseList;
    }

    /**
         * Delete the Address alias from static vault
         *
         * @param {string} aliasId ID of the alias to delete
         * @return {Promise<DeleteAddressResponse>}
         */
    deleteAddress(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/address/${aliasId}`);
    }
};

module.exports = Address;


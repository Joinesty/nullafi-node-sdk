/**
 *
 * @exports DriversLicense
 *
 */
class DriversLicense {
    /**
     *Creates an instance of DriversLicense.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
          * Create a new DriversLicense string to be aliased for a specific static vault
          *
          * @param {string} driverslicense
          * @param {string[]} tags
          * @return {Promise<any>}
          */
    async createDriversLicense(driverslicense, tags) {
        const result = this.vault.encrypt(driverslicense);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/driverslicense`, {
            driverslicense: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.driverslicense = this.vault.decrypt(response.iv, response.authTag, response.driverslicense);
        return response;
    }

    /**
         * Retrieve the DriversLicense string alias from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async retrieveDriversLicense(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/driverslicense/${tokenId}`);
        response.driverslicense = this.vault.decrypt(response.iv, response.authTag, response.driverslicense);
        return response;
    }

    /**
         * Delete the DriversLicense alias from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDriversLicense(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/driverslicense/${tokenId}`);
    }
};

module.exports = DriversLicense;

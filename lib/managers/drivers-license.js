/**
 *
 *
 * @export
 * @class DriversLicense
 */
module.exports = class DriversLicense {
    /**
     *Creates an instance of DriversLicense.
     * @param {StaticVault} vault
     * @memberof DriversLicense
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
          * Post a new DriversLicense string to be tokenized for a specific static vault
          *
          * @param {string} driverslicense
          * @param {string[]} tags
          * @return {Promise<any>}
          */
    async postDriversLicense(driverslicense, tags) {
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
         * Retrieve the DriversLicense string token from a static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getDriversLicense(tokenId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/driverslicense/${tokenId}`);
        response.driverslicense = this.vault.decrypt(response.iv, response.authTag, response.driverslicense);
        return response;
    }

    /**
         * Delete the DriversLicense token from static vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDriversLicense(tokenId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/driverslicense/${tokenId}`);
    }
};

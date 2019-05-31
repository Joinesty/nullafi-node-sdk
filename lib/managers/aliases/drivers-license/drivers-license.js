/**
 *
 * @exports DriversLicense
 * @class
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
          * @param {string} state
          * @return {Promise<CreateDriversLicenseResponse>}
          */
    async createDriversLicense(driverslicense, tags, state) {
        const result = this.vault.encrypt(driverslicense);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/driverslicense${state ? `/${state}` : ''}`, {
            driverslicense: result.encryptedData,
            driverslicenseHash: this.vault.hash(driverslicense),
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
         * @param {string} aliasId
         * @return {Promise<RetrieveDriversLicenseResponse>}
         */
    async retrieveDriversLicense(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/driverslicense/${aliasId}`);
        response.driverslicense = this.vault.decrypt(response.iv, response.authTag, response.driverslicense);
        return response;
    }

    /**
        * Retrieve the DriversLicense string alias from real driverslicense
        *
        * @param {string} driverslicense
        * @param {string[]} tags
        * @return {Promise<RetrieveDriversLicenseResponse[]>}
        */
    async retrieveDriversLicenseFromRealData(driverslicense, tags) {
        const query = {
            hash: this.vault.hash(driverslicense),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/driverslicense', query);

        responseList.forEach((response) => {
            response.driverslicense = this.vault.decrypt(response.iv, response.authTag, response.driverslicense);
        });
        return responseList;
    }

    /**
         * Delete the DriversLicense alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteDriversLicenseResponse>}
         */
    deleteDriversLicense(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/driverslicense/${aliasId}`);
    }
};

module.exports = DriversLicense;

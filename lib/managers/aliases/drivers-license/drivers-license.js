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
          * <pre><code>
            * Providing an incorrect state abbreviation will return a random state. The list of acceptable inputs is below.
            *
            * 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY',
            * 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
            * 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
            * Example call:
            * const driverslicenseAliasObj = await staticVault.driversLicense.createDriversLicense
            * ('123456789', 'NY' ['my-driversLicense-tag1', 'my-driversLicense-tag2']);
          *
          * @param {string} driverslicense Real driver's license to alias
          * @param {string} [state] US state abbreviations
          * @param {string[]} [tags] Strings to categorize alias
          * @return {Promise<CreateDriversLicenseResponse>}
          */
    async createDriversLicense(driverslicense, state, tags) {
        if (arguments.length === 2) {
            if (Object.prototype.toString.call(state) === '[object Array]') {
                tags = state;
                state = null;
            }
        }
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
         * Retrieve the DriversLicense string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveDriversLicenseResponse>}
         */
    async retrieveDriversLicense(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/driverslicense/${aliasId}`);
        response.driverslicense = this.vault.decrypt(response.iv, response.authTag, response.driverslicense);
        return response;
    }

    /**
        * Retrieve the DriversLicense string alias from real driverslicense.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} driverslicense Real driver's license
        * @param {string[]} [tags] Strings used to filter return results
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
         * @param {string} aliasId ID of the alias to delete
         * @return {Promise<DeleteDriversLicenseResponse>}
         */
    deleteDriversLicense(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/driverslicense/${aliasId}`);
    }
};

module.exports = DriversLicense;

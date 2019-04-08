/**
 *
 *
 * @export
 * @class DriversLicense
 */
module.exports = class DriversLicense {
    /**
     *Creates an instance of DriversLicense.
     * @param {*} client
     * @memberof DriversLicense
     */
    constructor(client) {
        this.client = client;
    }
    /**
          * Post a new DriversLicense string to be tokenized for a specific static vault
          *
          * @param {string} vaultId
          * @param {string} driverslicense
          * @param {string[]} tags
          * @return {Promise<any>}
          */
    postDriversLicense(vaultId, driverslicense, tags) {
        return this.client.post(`/vault/static/${vaultId}/driverslicense`, {
            driverslicense,
            tags,
        });
    }

    /**
         * Retrieve the DriversLicense string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getDriversLicense(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/driverslicense/${tokenId}`);
    }

    /**
         * Delete the DriversLicense token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDriversLicense(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/driverslicense/${tokenId}`);
    }
};


/**
 *
 *
 * @export
 * @class VehicleRegistration
 */
module.exports = class VehicleRegistration {
    /**
     *Creates an instance of VehicleRegistration.
     * @param {StaticVault} vault
     * @memberof VehicleRegistration
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Post a new VehicleRegistration string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} vehicleregistration
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postVehicleRegistration(vaultId, vehicleregistration, tags) {
        const result = this.vault.encrypt(taxpayerid);
        const response = this.vault.client.post(`/vault/static/${vaultId}/vehicleregistration`, {
            vehicleregistration: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        return response;
    }

    /**
         * Retrieve the VehicleRegistration string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getVehicleRegistration(vaultId, tokenId) {
        const response = this.vault.client.get(`/vault/static/${vaultId}/vehicleregistration/${tokenId}`);
        response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        return response;
    }

    /**
         * Delete the VehicleRegistration token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteVehicleRegistration(vaultId, tokenId) {
        return this.vault.client.delete(`/vault/static/${vaultId}/vehicleregistration/${tokenId}`);
    }
};


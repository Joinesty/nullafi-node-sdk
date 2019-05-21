/**
 *
 * @exports VehicleRegistration
 *
 */
class VehicleRegistration {
    /**
     *Creates an instance of VehicleRegistration.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Vehicle Registration string to be aliased for a specific static vault
      *
      * @param {string} vehicleregistration
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    async createVehicleRegistration(vehicleregistration, tags) {
        const result = this.vault.encrypt(vehicleregistration);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/vehicleregistration`, {
            vehicleregistration: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        return response;
    }

    /**
         * Retrieve the Vehicle Registration string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<any>}
         */
    async retrieveVehicleRegistration(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/vehicleregistration/${aliasId}`);
        response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        return response;
    }

    /**
         * Delete the Vehicle Registration alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<any>}
         */
    deleteVehicleRegistration(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/vehicleregistration/${aliasId}`);
    }
};

module.exports = VehicleRegistration;


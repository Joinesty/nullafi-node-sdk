
/**
 *
 *
 * @export
 * @class VehicleRegistration
 */
module.exports = class VehicleRegistration {
    /**
     *Creates an instance of VehicleRegistration.
     * @param {*} client
     * @memberof VehicleRegistration
     */
    constructor(client) {
        this.client = client;
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
        return this.client.post(`/vault/static/${vaultId}/vehicleregistration`, {
            vehicleregistration,
            tags,
        });
    }

    /**
         * Retrieve the VehicleRegistration string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getVehicleRegistration(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/vehicleregistration/${tokenId}`);
    }

    /**
         * Delete the VehicleRegistration token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteVehicleRegistration(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/vehicleregistration/${tokenId}`);
    }
};


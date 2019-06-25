/**
 *
 * @exports VehicleRegistration
 * @class
 *
 */
class VehicleRegistration {
    /**
     *Creates an instance of VehicleRegistration.
     * @param {StaticVault} vault
     *
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Vehicle Registration string to be aliased for a specific static vault
      * <pre><code>
        * Example Output:
        * ABC·1234
        * //example call
        * const vehicleRegistrationAliasObj = await staticVault.vehicleRegistration.createVehicleRegistration
        * ('92-45-6789', ['my-vehicleRegistration-tag1', 'my-vehicleRegistration-tag2']);
        * </pre></code>
      *
      * @param {string} vehicleregistration Vehicle registration to alias
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateVehicleRegistrationResponse>}
      */
    async createVehicleRegistration(vehicleregistration, tags) {
        const result = this.vault.encrypt(vehicleregistration);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/vehicleregistration`, {
            vehicleregistration: result.encryptedData,
            vehicleregistrationHash: this.vault.hash(vehicleregistration),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        return response;
    }

    /**
         * Retrieve the Vehicle Registration string alias from a static vault.
         * Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveVehicleRegistrationResponse>}
         */
    async retrieveVehicleRegistration(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/vehicleregistration/${aliasId}`);
        response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        return response;
    }

    /**
        * Retrieve the VehicleRegistration string alias from real vehicleregistration.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} vehicleregistration Real vehicleregistration
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveVehicleRegistrationResponse[]>}
        */
    async retrieveVehicleRegistrationFromRealData(vehicleregistration, tags) {
        const query = {
            hash: this.vault.hash(vehicleregistration),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/vehicleregistration`, query);
        responseList.forEach((response) => {
            response.vehicleregistration = this.vault.decrypt(response.iv, response.authTag, response.vehicleregistration);
        });
        return responseList;
    }

    /**
         * Delete the Vehicle Registration alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteVehicleRegistrationResponse>}
         */
    deleteVehicleRegistration(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/vehicleregistration/${aliasId}`);
    }
};

module.exports = VehicleRegistration;


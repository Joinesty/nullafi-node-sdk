/**
 *
 * @exports LastName
 *
 */
class LastName {
    /**
     *Creates an instance of LastName.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new LastName string to be aliased for a specific static vault
      *
      * @param {string} lastname
      * @param {string[]} tags
      * @return {Promise<CreateLastNameResponse>}
      */
    async createLastName(lastname, tags) {
        const result = this.vault.encrypt(lastname);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/lastname`, {
            lastname: result.encryptedData,
            lastnameHash: this.vault.hash(lastname),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.lastname = this.vault.decrypt(response.iv, response.authTag, response.lastname);
        return response;
    }

    /**
         * Retrieve the LastName string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveLastNameResponse>}
         */
    async retrieveLastName(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/lastname/${aliasId}`);
        response.lastname = this.vault.decrypt(response.iv, response.authTag, response.lastname);
        return response;
    }

    /**
         * Delete the LastName alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteLastNameResponse>}
         */
    deleteLastName(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/lastname/${aliasId}`);
    }
};

module.exports = LastName;


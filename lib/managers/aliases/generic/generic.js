/**
 *
 * @exports Generic
 *
 */
class Generic {
    /**
     *Creates an instance of Generic.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
   * Create a new Generic string to be aliased for a specific static vault
   *
   * @param {string} data
   * @param {string} regexTemplate
   * @param {string[]} tags
   * @return {Promise<CreateGenericResponse>}
   */
    async createGeneric(data, regexTemplate, tags) {
        const result = this.vault.encrypt(data);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/generic`, {
            data: result.encryptedData,
            template: regexTemplate,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Retrieve the Generic string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveGenericResponse>}
         */
    async retrieveGeneric(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/generic/${aliasId}`);
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Delete the Generic alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteGenericResponse>}
         */
    deleteGeneric(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/generic/${aliasId}`);
    }
};

module.exports = Generic;

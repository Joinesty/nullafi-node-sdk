/**
 *
 * @exports Generic
 * @class
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
   * <pre><code>
        * Example Generic Values:
        * // IP Number: [0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}
        * // Mac Address: [0-9A-F]{2}\:[0-9A-F]{2}\:[0-9A-F]{2}\:[0-9A-F]{2}\:[0-9A-F]{2}\:[0-9A-F]{2}
        * // IMEI: \d{15}
        * // ICD9 CODE: \d{3}\.\d
        * // URL: https://www\.[a-z]{12}\.(com|net|io)
        * const genericAliasObj = await staticVault.generic.createGeneric('192.0.2.1',
        *  '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', ['my-generic-tag1', 'my-generic-tag2']);
    * </pre></code>
   *
   * @param {string} data Data to alias
   * @param {string} regexTemplate
   * @param {string[]} [tags] Strings to categorize alias
   * @return {Promise<CreateGenericResponse>}
   */
    async createGeneric(data, regexTemplate, tags) {
        const result = this.vault.encrypt(data);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/generic`, {
            data: result.encryptedData,
            dataHash: this.vault.hash(data),
            template: regexTemplate,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
         * Retrieve the Generic string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveGenericResponse>}
         */
    async retrieveGeneric(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/generic/${aliasId}`);
        response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        return response;
    }

    /**
       * Retrieve the Generic string alias from real generic.
       * Real value must be an exact match and will also be case sensitive.
       * Returns an array of matching values. Array will be sorted by date created.
       *
       * @param {string} generic Real value
       * @param {string[]} [tags] Strings used to filter return results
       * @return {Promise<RetrieveGenericResponse[]>}
       */
    async retrieveGenericFromRealData(generic, tags) {
        const query = {
            hash: this.vault.hash(generic),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/generic`, query);
        responseList.forEach((response) => {
            response.data = this.vault.decrypt(response.iv, response.authTag, response.data);
        });
        return responseList;
    }


    /**
         * Delete the Generic alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteGenericResponse>}
         */
    deleteGeneric(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/generic/${aliasId}`);
    }
};

module.exports = Generic;

/**
 *
 * @exports FirstName
 * @class
 *
 */
class FirstName {
    /**
     *Creates an instance of FirstName.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new FirstName string to be aliased for a specific static vault
      *
      * @param {string} firstname
      * @param {string[]} tags
      * @return {Promise<CreateFirstNameResponse>}
      */
    async createFirstName(firstname, tags) {
        const result = this.vault.encrypt(firstname);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/firstname`, {
            firstname: result.encryptedData,
            firstnameHash: this.vault.hash(firstname),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        return response;
    }

    /**
         * Retrieve the FirstName string alias from a static vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveFirstNameResponse>}
         */
    async retrieveFirstName(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/firstname/${aliasId}`);
        response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        return response;
    }

    /**
        * Retrieve the FirstName string alias from real firstname
        *
        * @param {string} firstname
        * @param {string[]} tags
        * @return {Promise<RetrieveFirstNameResponse[]>}
        */
    async retrieveFirstNameFromRealData(firstname, tags) {
        const query = {
            hash: this.vault.hash(firstname),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/firstname', query);
        responseList.forEach((response) => {
            response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        });
        return responseList;
    }

    /**
         * Delete the FirstName alias from static vault
         *
         * @param {string} aliasId
         * @return {Promise<DeleteFirstNameResponse>}
         */
    deleteFirstName(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/firstname/${aliasId}`);
    }
};

module.exports = FirstName;


/**
 *
 * @exports LastName
 * @class
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
      * @param {string} lastname Last Name to alias
      * @param {string} [gender] Gender name should be based on
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateLastNameResponse>}
      */
    async createLastName(lastname, gender, tags) {
        const result = this.vault.encrypt(lastname);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/lastname${gender ? `/${gender}` : ''}`, {
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
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveLastNameResponse>}
         */
    async retrieveLastName(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/lastname/${aliasId}`);
        response.lastname = this.vault.decrypt(response.iv, response.authTag, response.lastname);
        return response;
    }

    /**
        * Retrieve the LastName string alias from real lastname
        *
        * @param {string} lastname Real last name
        * @param {string[]} [tags] Strings associated with alias
        * @return {Promise<RetrieveLastNameResponse[]>}
        */
    async retrieveLastNameFromRealData(lastname, tags) {
        const query = {
            hash: this.vault.hash(lastname),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/lastname', query);
        responseList.forEach((response) => {
            response.lastname = this.vault.decrypt(response.iv, response.authTag, response.lastname);
        });
        return responseList;
    }

    /**
         * Delete the LastName alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteLastNameResponse>}
         */
    deleteLastName(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/lastname/${aliasId}`);
    }
};

module.exports = LastName;


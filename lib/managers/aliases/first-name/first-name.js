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
      * <pre><code>
        * Genders available are:
        * "male",
        * "female"
        * Example call:
        * const firstNameAliasObj = await staticVault.firstName.createFirstName
        * ('John', ['my-fName-tag1', 'my-fName-tag2']);
        * </pre></code>
      *
      * @param {string} firstname First Name to alias
      * @param {string} [gender] Gender name should be based on
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateFirstNameResponse>}
      */
    async createFirstName(firstname, gender, tags) {
        if (arguments.length === 2 && Array.isArray(gender)) {
            tags = gender;
            gender = null;
        }
        const result = this.vault.encrypt(firstname);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/firstname${gender ? `/${gender}` : ''}`, {
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
         * Retrieve the First Name alias from a static vault.
         * Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve Id of alias to retrieve
         * @return {Promise<RetrieveFirstNameResponse>}
         */
    async retrieveFirstName(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/firstname/${aliasId}`);
        response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        return response;
    }

    /**
        * Retrieve the First Name alias from real firstname.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} firstname Real first name
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveFirstNameResponse[]>}
        */
    async retrieveFirstNameFromRealData(firstname, tags) {
        const query = {
            hash: this.vault.hash(firstname),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/firstname`, query);
        responseList.forEach((response) => {
            response.firstname = this.vault.decrypt(response.iv, response.authTag, response.firstname);
        });
        return responseList;
    }

    /**
         * Delete the FirstName alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteFirstNameResponse>}
         */
    deleteFirstName(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/firstname/${aliasId}`);
    }
};

module.exports = FirstName;


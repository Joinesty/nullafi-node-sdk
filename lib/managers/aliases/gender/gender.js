/**
 *
 * @exports Gender
 * @class
 *
 */
class Gender {
    /**
     *Creates an instance of Gender.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Gender string to be aliased for a specific static vault
      *
      * @param {string} gender Gender to alias
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateGenderResponse>}
      */
    async createGender(gender, tags) {
        const result = this.vault.encrypt(gender);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/gender`, {
            gender: result.encryptedData,
            genderHash: this.vault.hash(gender),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
         * Retrieve the Gender string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         * <pre><code>
            * Output options are:
            * "Male",
            * "Female",
            * "Other",
            * "Don't want to say"
            * Example call:
            * const genderAliasObj = await staticVault.gender.createGender('male', ['my-gender-tag1', 'my-gender-tag2']);
         * </pre></code>
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveGenderResponse>}
         */
    async retrieveGender(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/gender/${aliasId}`);
        response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        return response;
    }

    /**
        * Retrieve the Gender string alias from real gender.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} gender Real gender
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveGenderResponse[]>}
        */
    async retrieveGenderFromRealData(gender, tags) {
        const query = {
            hash: this.vault.hash(gender),
            tags,
        };

        const responseList = await this.vault.client.get(`/vault/static/${this.vault.id}/gender`, query);
        responseList.forEach((response) => {
            response.gender = this.vault.decrypt(response.iv, response.authTag, response.gender);
        });
        return responseList;
    }

    /**
         * Delete the Gender alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeleteGenderResponse>}
         */
    deleteGender(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/gender/${aliasId}`);
    }
};

module.exports = Gender;



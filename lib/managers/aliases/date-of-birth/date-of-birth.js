/**
 *
 * @exports DateOfBirth
 * @class
 *
 */
class DateOfBirth {
    /**
     *Creates an instance of DateOfBirth.
     * @param {StaticVault} vault Vault to store aliases
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new Date of birth string to be aliased for a specific static vault
      *
      * @param {string} dateofbirth Real date of birth
      * @param {Number} [year] 4 digit number
      * @param {Number} [month] 2 digit number
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreateDateOfBirthResponse>}
      */
    async createDateOfBirth(dateofbirth, year, month, tags) {
        const result = this.vault.encrypt(dateofbirth);
        const response = await this.vault.client
            .post(`/vault/static/${this.vault.id}/dateofbirth?${year ? `year=${year}&` : ''}${month ? `month=${month}` : ''}`, {
                dateofbirth: result.encryptedData,
                dateofbirthHash: this.vault.hash(dateofbirth),
                iv: result.initializationVector,
                authTag: result.authenticationTag,
                tags,
            });
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }
    /**
         * Retrieve the DateOfBirth string alias from a static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveDateOfBirthResponse>}
         */
    async retrieveDateOfBirth(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/dateofbirth/${aliasId}`);
        response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        return response;
    }

    /**
        * Retrieve the Address string alias from real address
        *
        * @param {string} dateofbirth Real date of birth
        * @param {string[]} [tags] Strings associated with alias
        * @return {Promise<RetrieveAddressResponse[]>}
        */
    async retrieveDateOfBirthFromRealData(dateofbirth, tags) {
        const query = {
            hash: this.vault.hash(dateofbirth),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/dateofbirth', query);
        responseList.forEach((response) => {
            response.dateofbirth = this.vault.decrypt(response.iv, response.authTag, response.dateofbirth);
        });
        return responseList;
    }

    /**
         * Delete the DateOfBirth alias from static vault
         *
         * @param {string} aliasId ID of the alias to delete
         * @return {Promise<DeleteDateOfBirthResponse>}
         */
    deleteDateOfBirth(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/dateofbirth/${aliasId}`);
    }
};

module.exports = DateOfBirth;


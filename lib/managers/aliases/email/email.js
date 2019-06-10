/**
 *
 * @exports Email
 * @class
 *
 */
class Email {
    /**
     *Creates an instance of Email.
     * @param {CommunicationVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }

    /**
     * Create a new Email to be aliased for a specific communication vault
     * <pre><code>
        * //input
        * realEmail@gmail.com
        * //output
        * cizljfhxrazvcy@fipale.com
        * const emailAlias = await communicationVault.email.createEmail
        * ('realEmail@gmail.com', ['my-tag-1', 'my-tag-2']);
        * </pre></code>
     *
     * @param {string} email Real email to alias
     * @param {string[]} [tags] Strings to categorize alias
     * @return {Promise<CreateEmailResponse>}
     */
    async createEmail(email, tags) {
        const result = this.vault.encrypt(email);
        const response = await this.vault.client.post(`/vault/communication/${this.vault.id}/email`, {
            email: result.encryptedData,
            emailHash: this.vault.hash(email),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });

        response.email = this.vault.decrypt(response.iv, response.authTag, response.email);
        return response;
    }

    /**
         * Retrieve the Email alias from a communication vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrieveEmailResponse>}
         */
    async retrieveEmail(aliasId) {
        const response = await this.vault.client.get(`/vault/communication/${this.vault.id}/email/${aliasId}`);
        response.email = this.vault.decrypt(response.iv, response.authTag, response.email);
        return response;
    }

    /**
        * Retrieve the Email alias from real email.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} email Real email
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrieveEmailResponse[]>}
        */
    async retrieveEmailFromRealData(email, tags) {
        const query = {
            hash: this.vault.hash(email),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/communication/email', query);

        responseList.forEach((response) => {
            response.email = this.vault.decrypt(response.iv, response.authTag, response.email);
        });

        return responseList;
    }

    /**
         * Delete the Email alias from communication vault
         *
         * @param {string} aliasId ID of the alias to delete
         * @return {Promise<DeleteEmailResponse>}
         */
    deleteEmail(aliasId) {
        return this.vault.client.delete(`/vault/communication/${this.vault.id}/email/${aliasId}`);
    }
};

module.exports = Email;

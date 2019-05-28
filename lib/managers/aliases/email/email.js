/**
 *
 * @exports Email
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
     *
     * @param {string} email
     * @param {string[]} tags
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
         * Retrieve the Email alias from a communication vault
         *
         * @param {string} aliasId
         * @return {Promise<RetrieveEmailResponse>}
         */
    async retrieveEmail(aliasId) {
        const response = await this.vault.client.get(`/vault/communication/${this.vault.id}/email/${aliasId}`);
        response.email = this.vault.decrypt(response.iv, response.authTag, response.email);
        return response;
    }

    /**
        * Retrieve the Email string alias from real email
        *
        * @param {string} email
        * @param {string[]} tags
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
         * @param {string} aliasId
         * @return {Promise<DeleteEmailResponse>}
         */
    deleteEmail(aliasId) {
        return this.vault.client.delete(`/vault/communication/${this.vault.id}/email/${aliasId}`);
    }
};

module.exports = Email;

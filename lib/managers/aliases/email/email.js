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
/**
 *
 *
 * @export
 * @class Email
 */
module.exports = class Email {
    /**
     *Creates an instance of Email.
     * @param {CommunicationVault} vault
     * @memberof Email
     */
    constructor(vault) {
        this.vault = vault;
    }

    /**
     * Post a new Email to be tokenized for a specific communication vault
     *
     * @param {string} email
     * @param {string[]} tags
     * @return {Promise<any>}
     */
    async postEmail(email, tags) {
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
         * Retrieve the Email token from a communication vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    async getEmail(tokenId) {
        const response = await this.vault.client.get(`/vault/communication/${this.vault.id}/email/${tokenId}`);
        response.email = this.vault.decrypt(response.iv, response.authTag, response.email);
        return response;
    }

    /**
         * Delete the Email token from communication vault
         *
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteEmail(tokenId) {
        return this.vault.client.delete(`/vault/communication/${this.vault.id}/email/${tokenId}`);
    }
};

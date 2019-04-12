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
     * @param {string} emailAddress
     * @param {string[]} tags
     * @return {Promise<any>}
     */
    async postEmail(emailAddress, tags) {
        const result = this.vault.encrypt(emailAddress);
        const response = await this.vault.client.post(`/vault/communication/${this.vault.id}/email`, {
            emailAddress: result.encryptedData,
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });

        response.emailAddress = this.vault.decrypt(response.iv, response.authTag, response.emailAddress);
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
        response.emailAddress = this.vault.decrypt(response.iv, response.authTag, response.emailAddress);
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

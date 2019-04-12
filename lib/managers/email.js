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
    postEmail(emailAddress, tags) {
        const result = this.vault.encrypt(emailAddress);
        const response = this.vault.client.post(`/vault/communication/${this.vault.id}/email`, {
            email: result.encryptedData,
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
    getEmail(tokenId) {
        const response = this.vault.client.get(`/vault/communication/${this.vault.id}/email/${tokenId}`);
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

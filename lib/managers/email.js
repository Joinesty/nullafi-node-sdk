/**
 *
 *
 * @export
 * @class Email
 */
module.exports = class Email {
    /**
     *Creates an instance of Email.
     * @param {Client} client
     * @memberof Email
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Post a new Email to be tokenized for a specific communication vault
     *
     * @param {string} vaultId
     * @param {string} emailAddress
     * @param {string[]} tags
     * @return {Promise<any>}
     */
    postEmail(vaultId, emailAddress, tags) {
        return this.client.post(`/vault/communication/${vaultId}/email`, {
            emailAddress,
            tags,
        });
    }

    /**
         * Retrieve the Email token from a communication vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getEmail(vaultId, tokenId) {
        return this.client.get(`/vault/communication/${vaultId}/email/${tokenId}`);
    }

    /**
         * Delete the Email token from communication vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteEmail(vaultId, tokenId) {
        return this.client.delete(`/vault/communication/${vaultId}/email/${tokenId}`);
    }
};

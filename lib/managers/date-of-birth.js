/**
 *
 *
 * @export
 * @class DateOfBirth
 */
module.exports = class DateOfBirth {
    /**
     *Creates an instance of DateOfBirth.
     * @param {*} client
     * @memberof DateOfBirth
     */
    constructor(client) {
        this.client = client;
    }
    /**
      * Post a new DateOfBirth string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} dateofbirth
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postDateOfBirth(vaultId, dateofbirth, tags) {
        return this.client.post(`/vault/static/${vaultId}/dateofbirth`, {
            dateofbirth,
            tags,
        });
    }

    /**
         * Retrieve the DateOfBirth string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getDateOfBirth(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/dateofbirth/${tokenId}`);
    }

    /**
         * Delete the DateOfBirth token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteDateOfBirth(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/dateofbirth/${tokenId}`);
    }
};


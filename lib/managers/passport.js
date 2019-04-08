/**
 *
 *
 * @export
 * @class Passport
 */
module.exports = class Passport {
    /**
     *Creates an instance of Passport.
     * @param {*} client
     * @memberof Passport
     */
    constructor(client) {
        this.client = client;
    }
    /**
      * Post a new Passport string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} passport
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postPassport(vaultId, passport, tags) {
        return this.client.post(`/vault/static/${vaultId}/passport`, {
            passport,
            tags,
        });
    }

    /**
         * Retrieve the Passport string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getPassport(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/passport/${tokenId}`);
    }

    /**
         * Delete the Passport token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deletePassport(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/passport/${tokenId}`);
    }
};


/**
 *
 *
 * @export
 * @class SSN
 */
module.exports = class SSN {
    /**
     *Creates an instance of SSN.
     * @param {*} client
     * @memberof SSN
     */
    constructor(client) {
        this.client = client;
    }
    /**
      * Post a new SSN string to be tokenized for a specific static vault
      *
      * @param {string} vaultId
      * @param {string} ssn
      * @param {string[]} tags
      * @return {Promise<any>}
      */
    postSSN(vaultId, ssn, tags) {
        return this.client.post(`/vault/static/${vaultId}/ssn`, {
            ssn,
            tags,
        });
    }

    /**
         * Retrieve the SSN string token from a static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    getSSN(vaultId, tokenId) {
        return this.client.get(`/vault/static/${vaultId}/ssn/${tokenId}`);
    }

    /**
         * Delete the SSN token from static vault
         *
         * @param {string} vaultId
         * @param {string} tokenId
         * @return {Promise<any>}
         */
    deleteSSN(vaultId, tokenId) {
        return this.client.delete(`/vault/static/${vaultId}/ssn/${tokenId}`);
    }
};

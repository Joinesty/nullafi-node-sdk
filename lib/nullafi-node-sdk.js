const Client = require('./client');

/**
 *
 *
 * @export
 * @class NullafiSDK
 */
module.exports = class NullafiSDK {
    /**
     *Creates an instance of NullafiSDK.
     * @param {string} apiKey
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     *  Create a new instance of Client
     *
     * @return {Promise<CLient>}
     */
    async createClient() {
        const client = new Client();
        await client.authenticate(this.apiKey);
        return client;
    }
};


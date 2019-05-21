const Client = require('./client');
/**
 *
 * @exports NullafiSDK
 *
 */
class NullafiSDK {
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
     * @return {Promise<Client>}
     */
    async createClient() {
        const client = new Client();
        await client.authenticate(this.apiKey);
        return client;
    }
};

module.exports = NullafiSDK;


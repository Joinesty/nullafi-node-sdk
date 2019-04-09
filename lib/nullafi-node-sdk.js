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
     *  Get current instance of Client or create a new one if doesn't exists
     *
     * @return {Promise<CLient>}
     */
    async getClient() {
        return this.client || await this.createClient();
    }

    /**
     *  Create a new instance of Client
     *
     * @return {Promise<CLient>}
     */
    async createClient() {
        this.client = new Client();
        await this.client.authenticate(this.apiKey);
        return this.client;
    }
};


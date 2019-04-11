/**
 * @fileoverview Nullafi API.
 */

const apiHost = 'https://enterprise-api.nullafi.com';
const got = require('got');
const queryString = require('query-string');

/**
 * API Class.
*/
module.exports = class API {
    /**
     * Method to send a GET request to the API
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async get(path, data) {
        const query = queryString.stringify(data);
        const response = await got.get(path, { query: query, baseUrl: apiHost, json: true });
        return response.body;
    }
    /**
     * Method to send a PATCH request to the API with a JSON Payload
     *
     * @param {string} path
     * @param {Object} body
     * @return {Promise<any>}
     * @memberof Client
     */
    async patch(path, body) {
        const response = await got.patch(path, { body, baseUrl: apiHost, json: true });
        return response.body;
    }

    /**
     * Method to send a POST request to the API with a JSON Payload
     *
     * @param {string} path
     * @param {Object} body
     * @return {Promise<any>}
     * @memberof Client
     */
    async post(path, body) {
        const response = await got.post(path, { body, baseUrl: apiHost, json: true });
        return response.body;
    }

    /**
     * Method to send a DELETE request to the API
     *
     * @param {string} path
     * @param {Object} body
     * @return {Promise<any>}
     * @memberof Client
     */
    async delete(path, body) {
        const response = await got.delete(path, { body, baseUrl: apiHost, json: true });
        return response.body;
    }

    /**
     * Method to send a POST request to the API with a JSON Payload
     *
     * @param {string} path
     * @param {Object} body
     * @return {Promise<any>}
     * @memberof Client
     */
    async put(path, body) {
        const response = await got.put(path, { body, baseUrl: apiHost, json: true });
        return response.body;
    }
};
/**
 * @fileoverview Nullafi API.
 */

/**
 * API Class.
*/
export default class API {
    /**
     * Method to send a GET request to the API
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async get(path, data) {
        return this.request('GET', path, data);
    }

    /**
     * Method to send a PATCH request to the API with a JSON Payload
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async patch(path, data) {
        return this.request('PATCH', path, data);
    }

    /**
     * Method to send a POST request to the API with a JSON Payload
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async post(path, data) {
        return this.request('POST', path, data);
    }

    /**
     * Method to send a POST request to the API with a Form-Data Payload
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async postFormData(path, data) {
        return this.request('POST', path, data, true, false);
    }

    /**
     * Method to send a DELETE request to the API
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async delete(path, data) {
        return this.request('DELETE', path, data);
    }

    /**
     * Method to send a POST request to the API with a JSON Payload
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async put(path, data) {
        return this.request('PUT', path, data);
    }

    /**
     * Method to send a GET request to the API
     * that return an asset (img, files, etc, as a buffer array)
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    async getArrayBuffer(path, data) {
        const url = this.endpoint(path, 'GET', data);
        const options = this.createOptionsObject(path, 'GET', data, true);

        return fetch(url, options)
            .then((data) => {
                if (data) {
                    if (data.status >= 400) return Promise.reject(data);
                    return data.arrayBuffer()
                        .then((responseData) => {
                            return responseData;
                        });
                }
            })
            .catch((err) => this._handleError(err));
    }

    /**
     * Base method to send requests to the API
     *
     * @param {string} method
     * @param {string} path
     * @param {Object} data
     * @param {boolean} [allowTokenRefresh=true]
     * @param {boolean} [isJson=true]
     * @return {Promise<any>}
     * @memberof Client
     */
    async request(method, path, data, allowTokenRefresh = true, isJson = true) {
        const url = this.endpoint(path, method, data);
        const options = this.createOptionsObject(path, method, data, isJson);

        return fetch(url, options)
            .then((data) => {
                if (data) {
                    if (data.status >= 400) return Promise.reject(data);

                    const fallback = data.clone().text();
                    return data.json()
                        .catch(() => fallback)
                        .then((responseData) => {
                            return responseData;
                        });
                }
            })
            .catch((err) => this._handleError(err));
    }

    /**
     * Create options object to be used for the API request
     *
     * @param {string} path
     * @param {string} method
     * @param {Object} data
     * @param {boolean} [isJson=true]
     * @return {Promise<any>}
     * @memberof Client
     */
    createOptionsObject(path, method, data, isJson = true) {
        const options = {
            method,
            body: null,
            headers: new Headers({
                'Authorization': 'Bearer ' + appStore.userToken,
            }),
        };

        if (method.toUpperCase() !== 'GET') {
            if (isJson) {
                options.headers.append('Content-Type', 'application/json');
                options.body = JSON.stringify(data);
            } else {
                options.body = data;
            }
        }

        return options;
    }

    /**
     * Method to generate the endpoint based on the HTTP Method
     *
     * @param {string} path
     * @param {string} method
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    endpoint(path, method, data) {
        let url = `${this.apiHost}/${path}`;

        if (method.toUpperCase() === 'GET') {
            const query = !data ? null : Object.keys(data).reduce((obj, key) => {
                const item = data[key];

                if (Object.keys(item).length) {
                    obj[key] = JSON.stringify(item);
                } else {
                    obj[key] = item;
                }

                return obj;
            }, {});

            url = Url.format(Object.assign({}, Url.parse(url), { query }));
        }

        return url;
    }
}

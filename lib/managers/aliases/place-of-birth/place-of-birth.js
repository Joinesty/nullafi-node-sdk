/**
 *
 * @exports PlaceOfBirth
 * @class
 *
 */
class PlaceOfBirth {
    /**
     *Creates an instance of PlaceOfBirth.
     * @param {StaticVault} vault
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
      * Create a new PlaceOfBirth string to be aliased for a specific static vault
      * <pre><code>
      * Place of birth example:
        * city, state
        * Odachester, Washington
        * //example call with optional state param
        * const pobAliasObj = await staticVault.placeOfBirth.createPlaceOfBirth
        * ('Atlanta, Georgia', 'GA', ['my-pob-tag1', 'my-pob-tag2']);
        * Providing an incorrect state abbreviation will return a random state. The list of acceptable inputs is below.
        * 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY',
        * 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
        * 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
        * </pre></code>
      *
      * @param {string} placeofbirth Place of birth to alias
      * @param {string} [state] State to generate
      * @param {string[]} [tags] Strings to categorize alias
      * @return {Promise<CreatePlaceOfBirthResponse>}
      */
    async createPlaceOfBirth(placeofbirth, state, tags) {
        if (arguments.length === 2) {
            if (Object.prototype.toString.call(state) === '[object Array]') {
                tags = state;
                state = null;
            }
        }
        const result = this.vault.encrypt(placeofbirth);
        const response = await this.vault.client.post(`/vault/static/${this.vault.id}/placeofbirth${state ? `/${state}` : ''}`, {
            placeofbirth: result.encryptedData,
            placeofbirthHash: this.vault.hash(placeofbirth),
            iv: result.initializationVector,
            authTag: result.authenticationTag,
            tags,
        });
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
         * Retrieve the PlaceOfBirth string alias from a static vault. Returns an array of matching values. Array will be sorted by date created.
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<RetrievePlaceOfBirthResponse>}
         */
    async retrievePlaceOfBirth(aliasId) {
        const response = await this.vault.client.get(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
        response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        return response;
    }

    /**
        * Retrieve the PlaceOfBirth string alias from real placeofbirth.
        * Real value must be an exact match and will also be case sensitive.
        * Returns an array of matching values. Array will be sorted by date created.
        *
        * @param {string} placeofbirth Real placeofbirth
        * @param {string[]} [tags] Strings used to filter return results
        * @return {Promise<RetrievePlaceOfBirthResponse[]>}
        */
    async retrievePlaceOfBirthFromRealData(placeofbirth, tags) {
        const query = {
            hash: this.vault.hash(placeofbirth),
            tags,
        };

        const responseList = await this.vault.client.get('/vault/static/placeofbirth', query);
        responseList.forEach((response) => {
            response.placeofbirth = this.vault.decrypt(response.iv, response.authTag, response.placeofbirth);
        });
        return responseList;
    }

    /**
         * Delete the PlaceOfBirth alias from static vault
         *
         * @param {string} aliasId ID of the alias to retrieve
         * @return {Promise<DeletePlaceOfBirthResponse>}
         */
    deletePlaceOfBirth(aliasId) {
        return this.vault.client.delete(`/vault/static/${this.vault.id}/placeofbirth/${aliasId}`);
    }
};

module.exports = PlaceOfBirth;


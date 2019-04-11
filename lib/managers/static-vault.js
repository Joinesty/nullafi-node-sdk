const Address = require('./address');
const DateOfBirth = require('./date-of-birth');
const DriversLicense = require('./drivers-license');
const Gender = require('./gender');
const Passport = require('./passport');
const PlaceOfBirth = require('./place-of-birth');
const Race = require('./race');
const Random = require('./random');
const SSN = require('./ssn');
const TaxPayerID = require('./tax-payer-id');
const VehicleRegistration = require('./vehicle-registration');

/**
 *
 *
 * @export
 * @class Vault
 */
module.exports = class StaticVault {
    /**
     *Creates an instance of Vault.
     * @param {Client} client
     * @param {string} vaultId
     * @param {string} name
     * @param {string} masterKey
     * @memberof StaticVault
     */
    constructor(client, vaultId, name, masterKey) {
        this.client = client;
        this.vaultId = vaultId;
        this.name = name;
        this.masterKey = masterKey;

        this.address = new Address(this);
        this.dateOfBirth = new DateOfBirth(this);
        this.driversLicense = new DriversLicense(this);
        this.gender = new Gender(this);
        this.passport = new Passport(this);
        this.placeOfBirth = new PlaceOfBirth(this);
        this.race = new Race(this);
        this.random = new Random(this);
        this.ssn = new SSN(this);
        this.taxPayerId = new TaxPayerID(this);
        this.vault = new Vault(this);
        this.vehicleRegistration = new VehicleRegistration(this);
    }

    /**
             * Encrypt static tokens (before sending info to the API)
             *
             * @param {string} value
             * @return {Object}
             */
    encrypt(value) {
        const iv = this._security.aesGenerateInitializationVector();
        return this._security.aesEncrypt(this.masterKey, iv, value);
    }
    /**
         * Encrypt static tokens (before sending info to the API)
         *
         * @param {string} iv
         * @param {string} authTag
         * @param {string} value
         * @return {string}
         */
    decrypt(iv, authTag, value) {
        return this._security.aesDecrypt(this.masterKey, iv, authTag, value);
    }
    /**
         *  Request the API to create a new static vault
         *
         * @param {Client} client
         * @param {string} name
         * @param {string[]} tags
         * @return {Promise<object>}
         * @memberof StaticVault
         */
    static async postStaticVault(client, name, tags) {
        const response = await client.post('/vault/static', {
            name,
            tags,
        });

        return new StaticVault(client, response.id, response.name, this._security.aesGenerateMasterKey());
    }

    /**
         * Get the static vault from id
         *
         * @param {Client} client
         * @param {string} vaultId
         * @param {string} masterKey
         * @return {Promise<any>}
         * @memberof StaticVault
         */
    static async getStaticVault(client, vaultId, masterKey) {
        const response = this.client.get(`/vault/static/${vaultId}`);
        return new StaticVault(client, vaultId, response.name, masterKey);
    }
};

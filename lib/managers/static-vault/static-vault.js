const Security = require('../services/security');

const Address = require('./aliases/address/address');
const FirstName = require('./aliases/first-name/first-name');
const LastName = require('./aliases/last-name/last-name');
const DateOfBirth = require('./aliases/date-of-birth/date-of-birth');
const DriversLicense = require('./aliases/drivers-license/drivers-license');
const Gender = require('./aliases/gender/gender');
const Passport = require('./aliases/passport/passport');
const PlaceOfBirth = require('./aliases/place-of-birth/place-of-birth');
const Race = require('./aliases/race/race');
const Random = require('./aliases/random/random');
const SSN = require('./aliases/ssn/ssn');
const Generic = require('./aliases/generic/generic');
const Taxpayerid = require('./aliases/tax-payer-id/tax-payer-id');
const VehicleRegistration = require('./aliases/vehicle-registration/vehicle-registration');

/**
 *
 * @exports StaticVault
 *
 */
class StaticVault {
    /**
     *Creates an instance of Vault.
     * @param {Client} client
     * @param {string} vaultId
     * @param {string} vaultName
     * @param {string} masterKey
     */
    constructor(client, vaultId, vaultName, masterKey) {
        this.security = new Security();
        this.client = client;
        this.id = vaultId;
        this.vaultName = vaultName;
        this.masterKey = masterKey;

        this.generic = new Generic(this);
        this.address = new Address(this);
        this.firstName = new FirstName(this);
        this.lastName = new LastName(this);
        this.dateOfBirth = new DateOfBirth(this);
        this.driversLicense = new DriversLicense(this);
        this.gender = new Gender(this);
        this.passport = new Passport(this);
        this.placeOfBirth = new PlaceOfBirth(this);
        this.race = new Race(this);
        this.random = new Random(this);
        this.ssn = new SSN(this);
        this.Taxpayerid = new Taxpayerid(this);
        this.vehicleRegistration = new VehicleRegistration(this);
    }

    /**
             * Encrypt static aliases (before sending info to the API)
             *
             * @param {string} value
             * @return {Object}
             */
    encrypt(value) {
        const iv = this.security.aesGenerateInitializationVector();
        return this.security.aesEncrypt(this.masterKey, iv, value);
    }
    /**
         * Decrypt static aliases
         *
         * @param {string} iv
         * @param {string} authTag
         * @param {string} value
         * @return {string}
         */
    decrypt(iv, authTag, value) {
        return this.security.aesDecrypt(this.masterKey, iv, authTag, value);
    }
    /**
         *  Request the API to create a new static vault
         *
         * @param {Client} client
         * @param {string} name
         * @param {string[]} tags
         * @return {Promise<CreateStaticVaultResponse>}
         */
    static async createStaticVault(client, name, tags) {
        const response = await client.post('/vault/static', {
            name,
            tags,
        });

        const security = new Security();

        return new StaticVault(client, response.id, response.name, security.aesGenerateMasterKey());
    }

    /**
         * Retrieve the static vault from id
         *
         * @param {Client} client
         * @param {string} vaultId
         * @param {string} masterKey
         * @return {Promise<StaticVault>}
         */
    static async retrieveStaticVault(client, vaultId, masterKey) {
        const response = await client.get(`/vault/static/${vaultId}`);
        return new StaticVault(client, response.id, response.name, masterKey);
    }
};

module.exports = StaticVault;

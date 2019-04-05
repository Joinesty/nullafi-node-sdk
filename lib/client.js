/**
 * @fileoverview Nullafi API Client.
 */

const API = require('./services/api');
const Security = require('./services/security');
const Address = require('./managers/address');
const DateOfBirth = require('./managers/date-of-birth');
const DriversLicense = require('./managers/drivers-license');
const Email = require('./managers/email');
const Gender = require('./managers/gender');
const Passport = require('./managers/passport');
const PlaceOfBirth = require('./managers/place-of-birth');
const Race = require('./managers/race');
const Random = require('./managers/random');
const SSN = require('./managers/ssn');
const TaxPayerID = require('./managers/tax-payer-id');
const Vault = require('./managers/vault');
const VehicleRegistration = require('./managers/vehicle-registration');

/**
 * Client Class.
*/
module.exports = class Client extends API {
    /**
     *Creates an instance of Client.
     * @param {string} sessionToken
     * @memberof Client
     */
    constructor(sessionToken) {
        super(sessionToken);

        this._security = new Security();

        this.address = new Address(this);
        this.dateOfBirth = new DateOfBirth(this);
        this.driversLicense = new DriversLicense(this);
        this.email = new Email(this);
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
};

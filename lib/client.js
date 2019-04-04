/**
 * @fileoverview Nullafi API Client.
 */

import API from './services/api';
import Security from './services/security';
import Address from './managers/address';
import DateOfBirth from './managers/date-of-birth';
import DriversLicense from './managers/drivers-license';
import Email from './managers/email';
import Gender from './managers/gender';
import Passport from './managers/passport';
import PlaceOfBirth from './managers/place-of-birth';
import Race from './managers/race';
import Random from './managers/random';
import SSN from './managers/ssn';
import TaxPayerID from './managers/tax-payer-id';
import Vault from './managers/vault';
import VehicleRegistration from './managers/vehicle-registration';

/**
 * Client Class.
*/
export default class Client extends API {
    /**
     *Creates an instance of Client.
     * @param {string} sessionToken
     * @memberof Client
     */
    constructor(sessionToken) {
        super();

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


    /**
     * Method to send a GET request to the API
     *
     * @param {string} path
     * @param {Object} data
     * @return {Promise<any>}
     * @memberof Client
     */
    get(path, data) {
        return super.get(path, this._security.encryptAndSign(data));
    }
}

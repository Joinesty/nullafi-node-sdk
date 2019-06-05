const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const NullafiNodeSDK = require('@joinesty/nullafi-node-sdk');

const start = async () => {
    const app = express();
    const sdk = new NullafiNodeSDK('WFPaEwyAZRwCjb+eCRbqoGf/Zgo/OcWUx9q6//yfCk0=');
    const client = await sdk.createClient();

    const exampleStore = {
        vaultObj: null,
        ssnAlias: null,
        firstNameAlias: null,
        addressAlias: null,
        dateOfBirthAlias: null,
        driversLicenseAlias: null,
        genderAlias: null,
        genericAlias: null,
        lastNameAlias: null,
        passportAlias: null,
        placeOfBirthAlias: null,
        raceAlias: null,
        randomAlias: null,
        vehicleRegistrationAlias: null,
    };

    app.engine('hbs', handlebars({
        extname: '.hbs',
    }));
    app.set('view engine', 'hbs');

    // We need to parse POST bodies for form submissions
    app.use(bodyParser.urlencoded({
        extended: false,
    }));

    app.get('/', (req, res) => {
        res.render('home', exampleStore);
    });

    app.get('/reset', (req, res) => {
        exampleStore.vaultObj = null;
        exampleStore.communicationVaultObj = null;
        exampleStore.emailAlias = null;
        exampleStore.genericAlias = null;
        exampleStore.ssnAlias = null;
        exampleStore.firstNameAlias = null;
        exampleStore.addressAlias = null;
        exampleStore.dateOfBirthAlias = null;
        exampleStore.driversLicenseAlias = null;
        exampleStore.genderAlias = null;
        exampleStore.lastNameAlias = null;
        exampleStore.passportAlias = null;
        exampleStore.placeOfBirthAlias = null;
        exampleStore.raceAlias = null;
        exampleStore.randomAlias = null;
        exampleStore.vehicleRegistrationAlias = null;
        res.redirect('/');
    });

    app.post('/static/vault', async (req, res) => {
        exampleStore.vaultObj = await client.addStaticVault(req.body.vaultName, ['example-static-tag']);
        res.redirect('/');
    });

    app.post('/communication/vault', async (req, res) => {
        exampleStore.communicationVaultObj = await client.addCommunicationVault(req.body.vaultName, ['example-communication-tag']);
        res.redirect('/');
    });

    app.post('/communication/email', async (req, res) => {
        exampleStore.emailAlias = await exampleStore.communicationVaultObj.email.postEmail(req.body.email, ['example-email-tag']);
        res.redirect('/');
    });

    app.post('/static/generic', async (req, res) => {
        exampleStore.genericAlias = await exampleStore.vaultObj.generic.postGeneric(req.body.generic, req.body.template, ['example-generic-tag']);
        res.redirect('/');
    });

    app.post('/static/ssn', async (req, res) => {
        exampleStore.ssnAlias = await exampleStore.vaultObj.ssn.postSSN(req.body.ssn, ['example-ssn-tag']);
        res.redirect('/');
    });

    app.post('/static/firstName', async (req, res) => {
        exampleStore.firstNameAlias = await exampleStore.vaultObj.firstName.postFirstName(req.body.firstName, ['example-firstName-tag']);
        res.redirect('/');
    });

    app.post('/static/address', async (req, res) => {
        exampleStore.addressAlias = await exampleStore.vaultObj.address.postAddress(req.body.address, ['example-address-tag']);
        res.redirect('/');
    });

    app.post('/static/dateOfBirth', async (req, res) => {
        exampleStore.dateOfBirthAlias = await exampleStore.vaultObj.dateOfBirth.postDateOfBirth(req.body.dateOfBirth, ['example-dateofbirth-tag']);
        res.redirect('/');
    });

    app.post('/static/driversLicense', async (req, res) => {
        exampleStore.driversLicenseAlias = await exampleStore.vaultObj.driversLicense
            .postDriversLicense(req.body.driversLicense, ['example-driverslicense-tag']);
        res.redirect('/');
    });

    app.post('/static/gender', async (req, res) => {
        exampleStore.genderAlias = await exampleStore.vaultObj.gender.postGender(req.body.gender, ['example-gender-tag']);
        res.redirect('/');
    });

    app.post('/static/lastName', async (req, res) => {
        exampleStore.lastNameAlias = await exampleStore.vaultObj.lastName.postLastName(req.body.lastName, ['example-lastName-tag']);
        res.redirect('/');
    });

    app.post('/static/passport', async (req, res) => {
        exampleStore.passportAlias = await exampleStore.vaultObj.passport.postPassport(req.body.passport, ['example-passport-tag']);
        res.redirect('/');
    });

    app.post('/static/placeOfBirth', async (req, res) => {
        exampleStore.placeOfBirthAlias = await exampleStore.vaultObj.placeOfBirth
            .postPlaceOfBirth(req.body.placeOfBirth, ['example-placeofbirth-tag']);
        res.redirect('/');
    });

    app.post('/static/race', async (req, res) => {
        exampleStore.raceAlias = await exampleStore.vaultObj.race.postRace(req.body.race, ['example-race-tag']);
        res.redirect('/');
    });

    app.post('/static/random', async (req, res) => {
        exampleStore.randomAlias = await exampleStore.vaultObj.random.postRandom(req.body.random, ['example-random-tag']);
        res.redirect('/');
    });

    app.post('/static/vehicleRegistration', async (req, res) => {
        exampleStore.vehicleRegistrationAlias = await exampleStore.vaultObj.vehicleRegistration
            .postVehicleRegistration(req.body.vehicleRegistration, ['example-vehicleregistration-tag']);
        res.redirect('/');
    });

    app.listen(3000);
    console.log('Server started!');
    console.log('Visit http://localhost:3000/ to start.');
};

start();

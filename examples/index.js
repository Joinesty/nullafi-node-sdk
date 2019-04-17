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
        ssnToken: null,
        firstNameToken: null,
        addressToken: null,
        dateOfBirthToken: null,
        driversLicenseToken: null,
        genderToken: null,
        lastNameToken: null,
        passportToken: null,
        placeOfBirthToken: null,
        raceToken: null,
        randomToken: null,
        vehicleRegistrationToken: null,
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
        exampleStore.ssnToken = null;
        exampleStore.firstNameToken = null;
        exampleStore.addressToken = null;
        exampleStore.dateOfBirthToken = null;
        exampleStore.driversLicenseToken = null;
        exampleStore.genderToken = null;
        exampleStore.lastNameToken = null;
        exampleStore.passportToken = null;
        exampleStore.placeOfBirthToken = null;
        exampleStore.raceToken = null;
        exampleStore.randomToken = null;
        exampleStore.vehicleRegistrationToken = null;
        res.redirect('/');
    });

    app.post('/static/vault', async (req, res) => {
        exampleStore.vaultObj = await client.addStaticVault(req.body.vaultName, ['example-static-tag']);
        res.redirect('/');
    });

    app.post('/static/ssn', async (req, res) => {
        exampleStore.ssnToken = await exampleStore.vaultObj.ssn.postSSN(req.body.ssn, ['example-ssn-tag']);
        res.redirect('/');
    });

    app.post('/static/firstName', async (req, res) => {
        exampleStore.firstNameToken = await exampleStore.vaultObj.firstName.postFirstName(req.body.firstName, ['example-firstName-tag']);
        res.redirect('/');
    });

    app.post('/static/address', async (req, res) => {
        exampleStore.addressToken = await exampleStore.vaultObj.address.postAddress(req.body.address, ['example-address-tag']);
        res.redirect('/');
    });

    app.post('/static/dateOfBirth', async (req, res) => {
        exampleStore.dateOfBirthToken = await exampleStore.vaultObj.dateOfBirth.postDateOfBirth(req.body.dateOfBirth, ['example-dateofbirth-tag']);
        res.redirect('/');
    });

    app.post('/static/driversLicense', async (req, res) => {
        exampleStore.driversLicenseToken = await exampleStore.vaultObj.driversLicense
            .postDriversLicense(req.body.driversLicense, ['example-driverslicense-tag']);
        res.redirect('/');
    });

    app.post('/static/gender', async (req, res) => {
        exampleStore.genderToken = await exampleStore.vaultObj.gender.postGender(req.body.gender, ['example-gender-tag']);
        res.redirect('/');
    });

    app.post('/static/lastName', async (req, res) => {
        exampleStore.lastNameToken = await exampleStore.vaultObj.lastName.postLastName(req.body.lastName, ['example-lastName-tag']);
        res.redirect('/');
    });

    app.post('/static/passport', async (req, res) => {
        exampleStore.passportToken = await exampleStore.vaultObj.passport.postPassport(req.body.passport, ['example-passport-tag']);
        res.redirect('/');
    });

    app.post('/static/placeOfBirth', async (req, res) => {
        exampleStore.placeOfBirthToken = await exampleStore.vaultObj.placeOfBirth
            .postPlaceOfBirth(req.body.placeOfBirth, ['example-placeofbirth-tag']);
        res.redirect('/');
    });

    app.post('/static/race', async (req, res) => {
        exampleStore.raceToken = await exampleStore.vaultObj.race.postRace(req.body.race, ['example-race-tag']);
        res.redirect('/');
    });

    app.post('/static/random', async (req, res) => {
        exampleStore.randomToken = await exampleStore.vaultObj.random.postRandom(req.body.random, ['example-random-tag']);
        res.redirect('/');
    });

    app.post('/static/vehicleRegistration', async (req, res) => {
        exampleStore.vehicleRegistrationToken = await exampleStore.vaultObj.vehicleRegistration
            .postVehicleRegistration(req.body.vehicleRegistration, ['example-vehicleregistration-tag']);
        res.redirect('/');
    });

    app.listen(3000);
    console.log('Server started!');
    console.log('Visit http://localhost:3000/ to start.');
};

start();

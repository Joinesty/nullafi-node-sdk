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

    app.post('/static/addressToken', async (req, res) => {
        exampleStore.addressToken = await exampleStore.vaultObj.address.postAddress(req.body.address, ['example-address-tag']);
        res.redirect('/');
    });

    app.listen(3000);
    console.log('Server started!');
    console.log('Visit http://localhost:3000/ to start.');
};

start();

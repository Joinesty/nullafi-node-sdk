const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const NullafiNodeSDK = require('@joinesty/nullafi-node-sdk');

const start = async () => {
    const app = express();
    const sdk = new NullafiNodeSDK('YOU API KEY');
    const client = await sdk.createClient();

    const exampleStore = {
        vaultObj: null,
        ssnToken: null,
        nameToke: null,
        addressToken: null,
    };

    app.engine('hbs', handlebars({
        defaultLayout: 'main',
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

    app.post('/static/vault', async (req, res) => {
        exampleStore.vaultObj = await client.addStaticVault(req.body.vaultName, ['example-tag']);
        res.render('home');
    });

    app.post('/static/ssn', async (req, res) => {
        exampleStore.vaultObj.
        res.render('home');
    });
};

start();

const nock = require('nock');
const Client = require('./client');
const Security = require('./services/security');
const { expect } = require('chai');

describe('Client service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('authenticate', () => {
        it('should get the sessionToken from the response', async () => {
            nock(apiHost)
                .post('/authentication/token', { apiKey: 'testKey'})
                .reply(200, { token: 'some-valid-token' });

            const client = new Client();
            await client.authenticate('testKey');
            expect(client).to.exist;
            expect(client.sessionToken).to.be.equal('some-valid-token');
        });
    });
    describe('createCommunicationVault', () => {
        it('should create a new communicationVault and get from the response', async () => {
            const security = new Security();
            const vaultMasterKey = security.aesGenerateMasterKey();
            const payload = {
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            nock(apiHost)
                .post('/vault/communication', (body) => {
                    return body.name === payload.name && body.tags.every((item) => payload.tags.find((i) => item === i));
                })
                .reply(200, (uri, body, callback) => {
                    const secLevelMasterkey = security.aesGenerateMasterKey();
                    const secLevelIv = security.aesGenerateInitializationVector();
                    const encryptedMasterkey = security.aesEncrypt(secLevelMasterkey, secLevelIv, vaultMasterKey);

                    response.masterKey = encryptedMasterkey.encryptedData;
                    response.authTag = encryptedMasterkey.authenticationTag;
                    response.iv = encryptedMasterkey.initializationVector;
                    response.sessionKey = security.rsaPublicEncrypt(body.publicKey, secLevelMasterkey);
                    callback(null, response);
                });

            const client = new Client();
            const vault = await client.createCommunicationVault('Main static vault for HR department', ['tag', 'test']);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.name).to.be.equal(payload.name);
            expect(vault.masterKey).to.be.equal(vaultMasterKey);
        });
    });
    describe('retrieveCommunicationVault', () => {
        it('should get the communicationVault from the response', async () => {
            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            nock(apiHost)
                .get('/vault/communication/d490157b23534215b0369a2685aab47f')
                .reply(200, response);

            const masterKey = 'masterkey-test';
            const client = new Client();
            const vault = await client.retrieveCommunicationVault(response.id, masterKey);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.name).to.not.be.empty;
            expect(vault.masterKey).to.not.be.empty;
        });
    });
    describe('createStaticVault', () => {
        it('should create a new vault and return the instance of the vault', async () => {
            const payload = {
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            nock(apiHost)
                .post('/vault/static', payload)
                .reply(200, response);

            const client = new Client();
            const vault = await client.createStaticVault('Main static vault for HR department', ['tag', 'test']);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.vaultName).to.be.equal(payload.name);
            expect(vault.masterKey).to.not.be.empty;
        });
    });

    describe('retrieveStaticVault', () => {
        it('should get a existing vault and return the instance of the vault', async () => {
            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f')
                .reply(200, response);

            const masterKey = 'masterkey-test';
            const client = new Client();
            const vault = await client.retrieveStaticVault(response.id, masterKey);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.vaultName).to.not.be.empty;
            expect(vault.masterKey).to.not.be.empty;
        });
    });
});

const nock = require('nock');
const CommunicationVault = require('./communication-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('Communication Vault Service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('createCommunicationVault', () => {
        it('should create a new vault and return the instance of the vault', async () => {
            const security = new Security();

            const payload = {
                name: 'Main communication vault for HR department',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main communication vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
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
            const vault = await CommunicationVault.createCommunicationVault(client, payload.name, payload.tags);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.name).to.be.equal(payload.name);
            expect(vault.masterKey).to.be.equal(vaultMasterKey);
            scope.done();
        });
    });

    describe('retrieveCommunicationVault', () => {
        it('should get an existing vault and return the instance of the vault', async () => {
            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main communication vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const scope = nock(apiHost)
                .get('/vault/communication/d490157b23534215b0369a2685aab47f')
                .reply(200, response);

            const masterKey = 'masterkey-test';
            const client = new Client();
            const vault = await CommunicationVault.retrieveCommunicationVault(client, response.id, masterKey);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.name).to.not.be.empty;
            expect(vault.masterKey).to.not.be.empty;
            scope.done();
        });
    });

    describe('encrypt', () => {
        it('should encrypt an info from this vault', async () => {
            const client = new CommunicationVault();
            const security = new Security();
            const vault = new CommunicationVault(client, 'vault-id', 'vault-name', security.aesGenerateMasterKey());
            const encrypted = vault.encrypt('someValue');
            expect(encrypted).to.not.be.empty;
            expect(encrypted.initializationVector).to.not.be.empty;
            expect(encrypted.authenticationTag).to.not.be.empty;
            expect(encrypted.encryptedData).to.not.be.empty;
        });
    });

    describe('encrypt', () => {
        it('should encrypt an info from this vault', async () => {
            const client = new CommunicationVault();
            const security = new Security();
            const vault = new CommunicationVault(client, 'vault-id', 'vault-name', security.aesGenerateMasterKey());
            const value = 'someValue';
            const encrypted = vault.encrypt(value);
            const decrypted = vault.decrypt(encrypted.initializationVector, encrypted.authenticationTag, encrypted.encryptedData);
            expect(decrypted).to.not.be.empty;
            expect(decrypted).to.be.equal(value);
        });
    });
});

const nock = require('nock');
const StaticVault = require('./static-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('Static Vault Service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
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
            const vault = await StaticVault.createStaticVault(client, 'Main static vault for HR department', ['tag', 'test']);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.vaultName).to.be.equal(payload.name);
            expect(vault.masterKey).to.not.be.empty;
        });
    });

    describe('retrieveStaticVault', () => {
        it('should get an existing vault and return the instance of the vault', async () => {
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
            const vault = await StaticVault.retrieveStaticVault(client, response.id, masterKey);
            expect(vault).to.not.be.empty;
            expect(vault.id).to.not.be.empty;
            expect(vault.vaultName).to.not.be.empty;
            expect(vault.masterKey).to.not.be.empty;
        });
    });

    describe('encrypt', () => {
        it('should encrypt an info from this vault', async () => {
            const client = new StaticVault();
            const security = new Security();
            const vault = new StaticVault(client, 'vault-id', 'vault-name', security.aesGenerateMasterKey());
            const encrypted = vault.encrypt('someValue');
            expect(encrypted).to.not.be.empty;
            expect(encrypted.initializationVector).to.not.be.empty;
            expect(encrypted.authenticationTag).to.not.be.empty;
            expect(encrypted.encryptedData).to.not.be.empty;
        });
    });

    describe('encrypt', () => {
        it('should encrypt an info from this vault', async () => {
            const client = new StaticVault();
            const security = new Security();
            const vault = new StaticVault(client, 'vault-id', 'vault-name', security.aesGenerateMasterKey());
            const value = 'someValue';
            const encrypted = vault.encrypt(value);
            const decrypted = vault.decrypt(encrypted.initializationVector, encrypted.authenticationTag, encrypted.encryptedData);
            expect(decrypted).to.not.be.empty;
            expect(decrypted).to.be.equal(value);
        });
    });
});

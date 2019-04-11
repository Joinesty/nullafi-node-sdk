const nock = require('nock');
const StaticVault = require('./static-vault');
const Client = require('../client');
const { expect } = require('chai');

describe('Address Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('postStaticVault', () => {
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

            const scope = nock(apiHost)
                .post('/vault/static', payload)
                .reply(200, response);

            const client = new Client();
            const vault = await StaticVault.postStaticVault(client, 'Main static vault for HR department', ['tag', 'test']);
            expect(vault).to.exist;
            expect(vault.id).to.exist;
            expect(vault.name).to.be.equal(payload.name);
            expect(vault.masterKey).to.exist;
            scope.done();
        });
    });

    describe('getStaticVault', () => {
        it('should get a existing vault and return the instance of the vault', async () => {
            const response = {
                id: 'd490157b23534215b0369a2685aab47f',
                name: 'Main static vault for HR department',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const scope = nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f')
                .reply(200, response);

            const masterKey = 'masterkey-test';
            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, response.id, masterKey);
            expect(vault).to.exist;
            expect(vault.id).to.exist;
            expect(vault.name).to.exist;
            expect(vault.masterKey).to.exist;
            scope.done();
        });
    });
});

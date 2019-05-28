const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('LastName Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';

    beforeEach(() => {
        const response = {
            id: 'd490157b23534215b0369a2685aab47f',
            lastname: 'Main static vault for HR department',
            tags: ['tag', 'test'],
            createdAt: '2018-07-14 T01:00:00Z',
        };

        nock(apiHost)
            .get('/vault/static/d490157b23534215b0369a2685aab47f')
            .reply(200, response);
    });

    describe('createLastName', () => {
        it('should create a new lastName and return the lastName', async () => {
            const security = new Security();
            const payload = {
                lastname: 'lastName-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                lastnameToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/lastname`, (body) => {
                    return body.lastname && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.lastname = body.lastname;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const lastName = await vault.lastName.createLastName(payload.lastname, payload.tags);
            expect(lastName).to.not.be.empty;
            expect(lastName.id).to.not.be.empty;
            expect(lastName.iv).to.not.be.empty;
            expect(lastName.authTag).to.not.be.empty;
            expect(lastName.lastname).to.be.equal(payload.lastname);
        });
    });

    describe('retrieveLastName', () => {
        it('should get an existing lastName', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                lastnameToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const lastNameExample = 'lastName-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/lastname/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedLastName = security.aesEncrypt(vaultMasterKey, iv, lastNameExample);
                    response.iv = encryptedLastName.initializationVector;
                    response.authTag = encryptedLastName.authenticationTag;
                    response.lastname = encryptedLastName.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const lastName = await vault.lastName.retrieveLastName(response.id);
            expect(lastName).to.not.be.empty;
            expect(lastName.id).to.not.be.empty;
            expect(lastName.iv).to.not.be.empty;
            expect(lastName.authTag).to.not.be.empty;
            expect(lastName.lastname).to.be.equal(lastNameExample);
        });
    });

    describe('deleteLastName', () => {
        it('should delete this specific lastName', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const lastNameId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/lastname/${lastNameId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.lastName.deleteLastName(lastNameId);
        });
    });
});

const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('FirstName Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    let vaultScope = null;

    beforeEach(() => {
        const response = {
            id: 'd490157b23534215b0369a2685aab47f',
            firstname: 'Main static vault for HR department',
            tags: ['tag', 'test'],
            createdAt: '2018-07-14 T01:00:00Z',
        };

        vaultScope = nock(apiHost)
            .get('/vault/static/d490157b23534215b0369a2685aab47f')
            .reply(200, response);
    });

    afterEach(() => {
        vaultScope.done();
    });

    describe('createFirstName', () => {
        it('should create a new firstName and return the firstName', async () => {
            const security = new Security();
            const payload = {
                firstname: 'firstName-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                firstnameToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/firstname`, (body) => {
                    return body.firstname && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.firstname = body.firstname;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const firstName = await vault.firstName.createFirstName(payload.firstname, payload.tags);
            expect(firstName).to.not.be.empty;
            expect(firstName.id).to.not.be.empty;
            expect(firstName.iv).to.not.be.empty;
            expect(firstName.authTag).to.not.be.empty;
            expect(firstName.firstname).to.be.equal(payload.firstname);
            scope.done();
        });
    });

    describe('retrieveFirstName', () => {
        it('should get an existing firstName', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                firstnameToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const firstNameExample = 'firstName-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/firstname/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedFirstName = security.aesEncrypt(vaultMasterKey, iv, firstNameExample);
                    response.iv = encryptedFirstName.initializationVector;
                    response.authTag = encryptedFirstName.authenticationTag;
                    response.firstname = encryptedFirstName.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            const firstName = await vault.firstName.retrieveFirstName(response.id);
            expect(firstName).to.not.be.empty;
            expect(firstName.id).to.not.be.empty;
            expect(firstName.iv).to.not.be.empty;
            expect(firstName.authTag).to.not.be.empty;
            expect(firstName.firstname).to.be.equal(firstNameExample);
            scope.done();
        });
    });

    describe('deleteFirstName', () => {
        it('should delete this specific firstName', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const firstNameId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/firstname/${firstNameId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            await vault.firstName.deleteFirstName(firstNameId);
            scope.done();
        });
    });
});

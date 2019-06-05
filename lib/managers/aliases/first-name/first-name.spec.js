const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('FirstName Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';

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

    describe('createFirstName', () => {
        it('should create a new firstName and return the firstName', async () => {
            const security = new Security();
            const payload = {
                firstname: 'firstName-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                firstnameAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
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
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const firstName = await vault.firstName.createFirstName(payload.firstname, payload.tags);
            expect(firstName).to.not.be.empty;
            expect(firstName.id).to.not.be.empty;
            expect(firstName.iv).to.not.be.empty;
            expect(firstName.authTag).to.not.be.empty;
            expect(firstName.firstname).to.be.equal(payload.firstname);
        });
    });

    describe('createFirstName (with optional parameter)', () => {
        it('should create a new firstName and return the firstName', async () => {
            const security = new Security();
            const payload = {
                firstname: 'firstName-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                firstnameAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/firstname/IL`, (body) => {
                    return body.firstname && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.firstname = body.firstname;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const firstName = await vault.firstName.createFirstName(payload.firstname, payload.tags, 'IL');
            expect(firstName).to.not.be.empty;
            expect(firstName.id).to.not.be.empty;
            expect(firstName.iv).to.not.be.empty;
            expect(firstName.authTag).to.not.be.empty;
            expect(firstName.firstname).to.be.equal(payload.firstname);
        });
    });

    describe('retrieveFirstName', () => {
        it('should get an existing firstName', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                firstnameAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const firstNameExample = 'firstName-example';

            nock(apiHost)
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
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const firstName = await vault.firstName.retrieveFirstName(response.id);
            expect(firstName).to.not.be.empty;
            expect(firstName.id).to.not.be.empty;
            expect(firstName.iv).to.not.be.empty;
            expect(firstName.authTag).to.not.be.empty;
            expect(firstName.firstname).to.be.equal(firstNameExample);
        });
    });

    describe('retrieveFirstNameFromRealData', () => {
        it('should get an existing firstname', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                firstnameAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const firstnameExample = 'firstname-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const firstnameHash = vault.hash(firstnameExample);

            nock(apiHost)
                .get(`/vault/static/firstname?hash=${encodeURIComponent(firstnameHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedFirstName = security.aesEncrypt(vaultMasterKey, iv, firstnameExample);
                    response.iv = encryptedFirstName.initializationVector;
                    response.authTag = encryptedFirstName.authenticationTag;
                    response.firstname = encryptedFirstName.encryptedData;
                    callback(null, [response]);
                });

            const firstnameList = await vault.firstName.retrieveFirstNameFromRealData(firstnameExample, ['1', '2']);
            firstnameList.forEach((firstname) => {
                expect(firstname).to.not.be.empty;
                expect(firstname.id).to.not.be.empty;
                expect(firstname.iv).to.not.be.empty;
                expect(firstname.authTag).to.not.be.empty;
                expect(firstname.firstname).to.be.equal(firstnameExample);
            });
        });
    });

    describe('deleteFirstName', () => {
        it('should delete this specific firstName', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const firstNameId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/firstname/${firstNameId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.firstName.deleteFirstName(firstNameId);
        });
    });
});

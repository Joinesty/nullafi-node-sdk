const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('Generic Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';

    beforeEach(() => {
        const response = {
            id: 'd490157b23534215b0369a2685aab47f',
            name: 'Main static vault for HR department',
            tags: ['tag', 'test'],
            createdAt: '2018-07-14 T01:00:00Z',
        };

        nock(apiHost)
            .get('/vault/static/d490157b23534215b0369a2685aab47f')
            .reply(200, response);
    });

    describe('createGeneric', () => {
        it('should create a new generic and return the generic', async () => {
            const security = new Security();
            const payload = {
                data: 'generic-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dataAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/generic`, (body) => {
                    return body.data && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.data = body.data;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const generic = await vault.generic.createGeneric(payload.data, '\d{3}[a-Z]{4}', payload.tags);
            expect(generic).to.not.be.empty;
            expect(generic.id).to.not.be.empty;
            expect(generic.iv).to.not.be.empty;
            expect(generic.authTag).to.not.be.empty;
            expect(generic.data).to.be.equal(payload.data);
        });
    });

    describe('retrieveGeneric', () => {
        it('should get an existing generic', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dataAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const genericExample = 'generic-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/generic/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedGeneric = security.aesEncrypt(vaultMasterKey, iv, genericExample);
                    response.iv = encryptedGeneric.initializationVector;
                    response.authTag = encryptedGeneric.authenticationTag;
                    response.data = encryptedGeneric.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const generic = await vault.generic.retrieveGeneric(response.id);
            expect(generic).to.not.be.empty;
            expect(generic.id).to.not.be.empty;
            expect(generic.iv).to.not.be.empty;
            expect(generic.authTag).to.not.be.empty;
            expect(generic.data).to.be.equal(genericExample);
        });
    });

    describe('retrieveGenericFromRealData', () => {
        it('should get an existing generic', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                genericAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const genericExample = 'generic-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const genericHash = vault.hash(genericExample);

            nock(apiHost)
                .get(`/vault/static/generic?hash=${encodeURIComponent(genericHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedGeneric = security.aesEncrypt(vaultMasterKey, iv, genericExample);
                    response.iv = encryptedGeneric.initializationVector;
                    response.authTag = encryptedGeneric.authenticationTag;
                    response.data = encryptedGeneric.encryptedData;
                    callback(null, [response]);
                });

            const genericList = await vault.generic.retrieveGenericFromRealData(genericExample, ['1', '2']);
            genericList.forEach((generic) => {
                expect(generic).to.not.be.empty;
                expect(generic.id).to.not.be.empty;
                expect(generic.iv).to.not.be.empty;
                expect(generic.authTag).to.not.be.empty;
                expect(generic.data).to.be.equal(genericExample);
            });
        });
    });

    describe('deleteGeneric', () => {
        it('should delete this specific generic', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const genericId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/generic/${genericId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.generic.deleteGeneric(genericId);
        });
    });
});

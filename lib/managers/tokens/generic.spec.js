const nock = require('nock');
const StaticVault = require('../static-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('Generic Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    let vaultScope = null;

    beforeEach(() => {
        const response = {
            id: 'd490157b23534215b0369a2685aab47f',
            name: 'Main static vault for HR department',
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

    describe('postGeneric', () => {
        it('should create a new generic and return the generic', async () => {
            const security = new Security();
            const payload = {
                data: 'generic-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dataToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
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
            const vault = await StaticVault.getStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const generic = await vault.generic.postGeneric(payload.data, '\d{3}[a-Z]{4}', payload.tags);
            expect(generic).to.not.be.empty;
            expect(generic.id).to.not.be.empty;
            expect(generic.iv).to.not.be.empty;
            expect(generic.authTag).to.not.be.empty;
            expect(generic.data).to.be.equal(payload.data);
            scope.done();
        });
    });

    describe('getGeneric', () => {
        it('should get an existing generic', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dataToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const genericExample = 'generic-example';

            const scope = nock(apiHost)
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
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            const generic = await vault.generic.getGeneric(response.id);
            expect(generic).to.not.be.empty;
            expect(generic.id).to.not.be.empty;
            expect(generic.iv).to.not.be.empty;
            expect(generic.authTag).to.not.be.empty;
            expect(generic.data).to.be.equal(genericExample);
            scope.done();
        });
    });

    describe('deleteGeneric', () => {
        it('should delete this specific generic', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const genericId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/generic/${genericId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            await vault.generic.deleteGeneric(genericId);
            scope.done();
        });
    });
});
const nock = require('nock');
const StaticVault = require('../static-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('Random Manager', () => {
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

    describe('createRandom', () => {
        it('should create a new random and return the random', async () => {
            const security = new Security();
            const payload = {
                data: 'random-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dataToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/random`, (body) => {
                    return body.data && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.data = body.data;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const random = await vault.random.createRandom(payload.data, payload.tags);
            expect(random).to.not.be.empty;
            expect(random.id).to.not.be.empty;
            expect(random.iv).to.not.be.empty;
            expect(random.authTag).to.not.be.empty;
            expect(random.data).to.be.equal(payload.data);
            scope.done();
        });
    });

    describe('retrieveRandom', () => {
        it('should get an existing random', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dataToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const randomExample = 'random-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/random/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedRandom = security.aesEncrypt(vaultMasterKey, iv, randomExample);
                    response.iv = encryptedRandom.initializationVector;
                    response.authTag = encryptedRandom.authenticationTag;
                    response.data = encryptedRandom.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            const random = await vault.random.retrieveRandom(response.id);
            expect(random).to.not.be.empty;
            expect(random.id).to.not.be.empty;
            expect(random.iv).to.not.be.empty;
            expect(random.authTag).to.not.be.empty;
            expect(random.data).to.be.equal(randomExample);
            scope.done();
        });
    });

    describe('deleteRandom', () => {
        it('should delete this specific random', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const randomId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/random/${randomId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            await vault.random.deleteRandom(randomId);
            scope.done();
        });
    });
});

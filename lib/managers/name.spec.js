const nock = require('nock');
const StaticVault = require('./static-vault');
const Client = require('../client');
const Security = require('../services/security');
const { expect } = require('chai');

describe('Name Manager', () => {
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

    describe('postName', () => {
        it('should create a new name and return the name', async () => {
            const security = new Security();
            const payload = {
                name: 'name-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                nameToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/name`, (body) => {
                    return body.name && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.name = body.name;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const name = await vault.name.postName(payload.name, payload.tags);
            expect(name).to.not.be.empty;
            expect(name.id).to.not.be.empty;
            expect(name.iv).to.not.be.empty;
            expect(name.authTag).to.not.be.empty;
            expect(name.name).to.be.equal(payload.name);
            scope.done();
        });
    });

    describe('getName', () => {
        it('should get an existing name', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                nameToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const nameExample = 'name-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/name/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedName = security.aesEncrypt(vaultMasterKey, iv, nameExample);
                    response.iv = encryptedName.initializationVector;
                    response.authTag = encryptedName.authenticationTag;
                    response.name = encryptedName.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            const name = await vault.name.getName(response.id);
            expect(name).to.not.be.empty;
            expect(name.id).to.not.be.empty;
            expect(name.iv).to.not.be.empty;
            expect(name.authTag).to.not.be.empty;
            expect(name.name).to.be.equal(nameExample);
            scope.done();
        });
    });

    describe('deleteName', () => {
        it('should delete this specific name', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const nameId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/name/${nameId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            await vault.name.deleteName(nameId);
            scope.done();
        });
    });
});

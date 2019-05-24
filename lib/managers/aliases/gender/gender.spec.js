const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('Gender Manager', () => {
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

    describe('createGender', () => {
        it('should create a new gender and return the gender', async () => {
            const security = new Security();
            const payload = {
                gender: 'gender-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                genderToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/gender`, (body) => {
                    return body.gender && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.gender = body.gender;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const gender = await vault.gender.createGender(payload.gender, payload.tags);
            expect(gender).to.not.be.empty;
            expect(gender.id).to.not.be.empty;
            expect(gender.iv).to.not.be.empty;
            expect(gender.authTag).to.not.be.empty;
            expect(gender.gender).to.be.equal(payload.gender);
            scope.done();
        });
    });

    describe('retrieveGender', () => {
        it('should get an existing gender', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                genderToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const genderExample = 'gender-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/gender/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedGender = security.aesEncrypt(vaultMasterKey, iv, genderExample);
                    response.iv = encryptedGender.initializationVector;
                    response.authTag = encryptedGender.authenticationTag;
                    response.gender = encryptedGender.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            const gender = await vault.gender.retrieveGender(response.id);
            expect(gender).to.not.be.empty;
            expect(gender.id).to.not.be.empty;
            expect(gender.iv).to.not.be.empty;
            expect(gender.authTag).to.not.be.empty;
            expect(gender.gender).to.be.equal(genderExample);
            scope.done();
        });
    });

    describe('deleteGender', () => {
        it('should delete this specific gender', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const genderId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/gender/${genderId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            await vault.gender.deleteGender(genderId);
            scope.done();
        });
    });
});

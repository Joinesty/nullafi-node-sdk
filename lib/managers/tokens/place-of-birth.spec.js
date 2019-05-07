const nock = require('nock');
const StaticVault = require('../static-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('PlaceOfBirth Manager', () => {
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

    describe('postPlaceOfBirth', () => {
        it('should create a new placeOfBirth and return the placeOfBirth', async () => {
            const security = new Security();
            const payload = {
                placeofbirth: 'placeOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                placeofbirthToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/placeofbirth`, (body) => {
                    return body.placeofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.placeofbirth = body.placeofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const placeOfBirth = await vault.placeOfBirth.postPlaceOfBirth(payload.placeofbirth, payload.tags);
            expect(placeOfBirth).to.not.be.empty;
            expect(placeOfBirth.id).to.not.be.empty;
            expect(placeOfBirth.iv).to.not.be.empty;
            expect(placeOfBirth.authTag).to.not.be.empty;
            expect(placeOfBirth.placeofbirth).to.be.equal(payload.placeofbirth);
            scope.done();
        });
    });

    describe('getPlaceOfBirth', () => {
        it('should get an existing placeOfBirth', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                placeofbirthToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const placeOfBirthExample = 'placeOfBirth-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/placeofbirth/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedPlaceOfBirth = security.aesEncrypt(vaultMasterKey, iv, placeOfBirthExample);
                    response.iv = encryptedPlaceOfBirth.initializationVector;
                    response.authTag = encryptedPlaceOfBirth.authenticationTag;
                    response.placeofbirth = encryptedPlaceOfBirth.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            const placeOfBirth = await vault.placeOfBirth.getPlaceOfBirth(response.id);
            expect(placeOfBirth).to.not.be.empty;
            expect(placeOfBirth.id).to.not.be.empty;
            expect(placeOfBirth.iv).to.not.be.empty;
            expect(placeOfBirth.authTag).to.not.be.empty;
            expect(placeOfBirth.placeofbirth).to.be.equal(placeOfBirthExample);
            scope.done();
        });
    });

    describe('deletePlaceOfBirth', () => {
        it('should delete this specific placeOfBirth', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const placeOfBirthId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/placeofbirth/${placeOfBirthId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            await vault.placeOfBirth.deletePlaceOfBirth(placeOfBirthId);
            scope.done();
        });
    });
});
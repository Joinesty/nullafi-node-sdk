const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('PlaceOfBirth Manager', () => {
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

    describe('createPlaceOfBirth', () => {
        it('should create a new placeOfBirth and return the placeOfBirth', async () => {
            const security = new Security();
            const payload = {
                placeofbirth: 'placeOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                placeofbirthToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
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
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const placeOfBirth = await vault.placeOfBirth.createPlaceOfBirth(payload.placeofbirth, payload.tags);
            expect(placeOfBirth).to.not.be.empty;
            expect(placeOfBirth.id).to.not.be.empty;
            expect(placeOfBirth.iv).to.not.be.empty;
            expect(placeOfBirth.authTag).to.not.be.empty;
            expect(placeOfBirth.placeofbirth).to.be.equal(payload.placeofbirth);
        });
    });

    describe('createPlaceOfBirth (with optional parameter)', () => {
        it('should create a new placeOfBirth and return the placeOfBirth', async () => {
            const security = new Security();
            const payload = {
                placeofbirth: 'placeOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                placeofbirthToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/placeofbirth/IL`, (body) => {
                    return body.placeofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.placeofbirth = body.placeofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const placeOfBirth = await vault.placeOfBirth.createPlaceOfBirth(payload.placeofbirth, payload.tags, 'IL');
            expect(placeOfBirth).to.not.be.empty;
            expect(placeOfBirth.id).to.not.be.empty;
            expect(placeOfBirth.iv).to.not.be.empty;
            expect(placeOfBirth.authTag).to.not.be.empty;
            expect(placeOfBirth.placeofbirth).to.be.equal(payload.placeofbirth);
        });
    });

    describe('retrievePlaceOfBirth', () => {
        it('should get an existing placeOfBirth', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                placeofbirthToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const placeOfBirthExample = 'placeOfBirth-example';

            nock(apiHost)
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
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const placeOfBirth = await vault.placeOfBirth.retrievePlaceOfBirth(response.id);
            expect(placeOfBirth).to.not.be.empty;
            expect(placeOfBirth.id).to.not.be.empty;
            expect(placeOfBirth.iv).to.not.be.empty;
            expect(placeOfBirth.authTag).to.not.be.empty;
            expect(placeOfBirth.placeofbirth).to.be.equal(placeOfBirthExample);
        });
    });

    describe('retrievePlaceOfBirthFromRealData', () => {
        it('should get an existing placeofbirth', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                placeofbirthToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const placeofbirthExample = 'placeofbirth-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const placeofbirthHash = vault.hash(placeofbirthExample);

            nock(apiHost)
                .get(`/vault/static/placeofbirth?hash=${encodeURIComponent(placeofbirthHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedPlaceOfBirth = security.aesEncrypt(vaultMasterKey, iv, placeofbirthExample);
                    response.iv = encryptedPlaceOfBirth.initializationVector;
                    response.authTag = encryptedPlaceOfBirth.authenticationTag;
                    response.placeofbirth = encryptedPlaceOfBirth.encryptedData;
                    callback(null, [response]);
                });

            const placeofbirthList = await vault.placeOfBirth.retrievePlaceOfBirthFromRealData(placeofbirthExample, ['1', '2']);
            placeofbirthList.forEach((placeofbirth) => {
                expect(placeofbirth).to.not.be.empty;
                expect(placeofbirth.id).to.not.be.empty;
                expect(placeofbirth.iv).to.not.be.empty;
                expect(placeofbirth.authTag).to.not.be.empty;
                expect(placeofbirth.placeofbirth).to.be.equal(placeofbirthExample);
            });
        });
    });

    describe('deletePlaceOfBirth', () => {
        it('should delete this specific placeOfBirth', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const placeOfBirthId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/placeofbirth/${placeOfBirthId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.placeOfBirth.deletePlaceOfBirth(placeOfBirthId);
        });
    });
});

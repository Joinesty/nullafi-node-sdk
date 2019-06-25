const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('DriversLicense Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';

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

    describe('createDriversLicense', () => {
        it('should create a new driversLicense and return the driversLicense', async () => {
            const security = new Security();
            const payload = {
                driverslicense: 'driversLicense-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                driverslicenseAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/driverslicense`, (body) => {
                    return body.driverslicense && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.driverslicense = body.driverslicense;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const driversLicense = await vault.driversLicense.createDriversLicense(payload.driverslicense, payload.tags);
            expect(driversLicense).to.not.be.empty;
            expect(driversLicense.id).to.not.be.empty;
            expect(driversLicense.iv).to.not.be.empty;
            expect(driversLicense.authTag).to.not.be.empty;
            expect(driversLicense.driverslicense).to.be.equal(payload.driverslicense);
        });
    });

    describe('createDriversLicense (with optional parameter)', () => {
        it('should create a new driversLicense and return the driversLicense', async () => {
            const security = new Security();
            const payload = {
                driverslicense: 'driversLicense-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                driverslicenseAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/driverslicense/IL`, (body) => {
                    return body.driverslicense && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.driverslicense = body.driverslicense;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const driversLicense = await vault.driversLicense.createDriversLicense(payload.driverslicense, 'IL', payload.tags);
            expect(driversLicense).to.not.be.empty;
            expect(driversLicense.id).to.not.be.empty;
            expect(driversLicense.iv).to.not.be.empty;
            expect(driversLicense.authTag).to.not.be.empty;
            expect(driversLicense.driverslicense).to.be.equal(payload.driverslicense);
        });
    });

    describe('retrieveDriversLicense', () => {
        it('should get an existing driversLicense', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                driverslicenseAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const driversLicenseExample = 'driversLicense-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/driverslicense/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedDriversLicense = security.aesEncrypt(vaultMasterKey, iv, driversLicenseExample);
                    response.iv = encryptedDriversLicense.initializationVector;
                    response.authTag = encryptedDriversLicense.authenticationTag;
                    response.driverslicense = encryptedDriversLicense.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const driversLicense = await vault.driversLicense.retrieveDriversLicense(response.id);
            expect(driversLicense).to.not.be.empty;
            expect(driversLicense.id).to.not.be.empty;
            expect(driversLicense.iv).to.not.be.empty;
            expect(driversLicense.authTag).to.not.be.empty;
            expect(driversLicense.driverslicense).to.be.equal(driversLicenseExample);
        });
    });

    describe('retrieveDriversLicenseFromRealData', () => {
        it('should get an existing driverslicense', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                driverslicenseAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const driverslicenseExample = 'driverslicense-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const driverslicenseHash = vault.hash(driverslicenseExample);

            nock(apiHost)
                .get(`/vault/static/${vaultId}/driverslicense?hash=${encodeURIComponent(driverslicenseHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedDriversLicense = security.aesEncrypt(vaultMasterKey, iv, driverslicenseExample);
                    response.iv = encryptedDriversLicense.initializationVector;
                    response.authTag = encryptedDriversLicense.authenticationTag;
                    response.driverslicense = encryptedDriversLicense.encryptedData;
                    callback(null, [response]);
                });

            const driverslicenseList = await vault.driversLicense.retrieveDriversLicenseFromRealData(driverslicenseExample, ['1', '2']);
            driverslicenseList.forEach((driverslicense) => {
                expect(driverslicense).to.not.be.empty;
                expect(driverslicense.id).to.not.be.empty;
                expect(driverslicense.iv).to.not.be.empty;
                expect(driverslicense.authTag).to.not.be.empty;
                expect(driverslicense.driverslicense).to.be.equal(driverslicenseExample);
            });
        });
    });

    describe('deleteDriversLicense', () => {
        it('should delete this specific driversLicense', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const driversLicenseId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/driverslicense/${driversLicenseId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.driversLicense.deleteDriversLicense(driversLicenseId);
        });
    });
});

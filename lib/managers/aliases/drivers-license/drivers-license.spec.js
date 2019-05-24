const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('DriversLicense Manager', () => {
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

    describe('createDriversLicense', () => {
        it('should create a new driversLicense and return the driversLicense', async () => {
            const security = new Security();
            const payload = {
                driverslicense: 'driversLicense-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                driverslicenseToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
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
            const vault = await StaticVault.createStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const driversLicense = await vault.driversLicense.createDriversLicense(payload.driverslicense, payload.tags);
            expect(driversLicense).to.not.be.empty;
            expect(driversLicense.id).to.not.be.empty;
            expect(driversLicense.iv).to.not.be.empty;
            expect(driversLicense.authTag).to.not.be.empty;
            expect(driversLicense.driverslicense).to.be.equal(payload.driverslicense);
            scope.done();
        });
    });

    describe('retrieveDriversLicense', () => {
        it('should get an existing driversLicense', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                driverslicenseToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const driversLicenseExample = 'driversLicense-example';

            const scope = nock(apiHost)
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
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            const driversLicense = await vault.driversLicense.retrieveDriversLicense(response.id);
            expect(driversLicense).to.not.be.empty;
            expect(driversLicense.id).to.not.be.empty;
            expect(driversLicense.iv).to.not.be.empty;
            expect(driversLicense.authTag).to.not.be.empty;
            expect(driversLicense.driverslicense).to.be.equal(driversLicenseExample);
            scope.done();
        });
    });

    describe('deleteDriversLicense', () => {
        it('should delete this specific driversLicense', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const driversLicenseId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/driverslicense/${driversLicenseId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            await vault.driversLicense.deleteDriversLicense(driversLicenseId);
            scope.done();
        });
    });
});
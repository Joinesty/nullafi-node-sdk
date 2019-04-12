const nock = require('nock');
const StaticVault = require('./static-vault');
const Client = require('../client');
const Security = require('../services/security');
const { expect } = require('chai');

describe('VehicleRegistration Manager', () => {
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

    describe('postVehicleRegistration', () => {
        it('should create a new vehicleRegistration and return the vehicleRegistration', async () => {
            const security = new Security();
            const payload = {
                vehicleregistration: 'vehicleRegistration-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                vehicleregistrationToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/vehicleregistration`, (body) => {
                    return body.vehicleregistration && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.vehicleregistration = body.vehicleregistration;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const vehicleRegistration = await vault.vehicleRegistration.postVehicleRegistration(payload.vehicleregistration, payload.tags);
            expect(vehicleRegistration).to.not.be.empty;
            expect(vehicleRegistration.id).to.not.be.empty;
            expect(vehicleRegistration.iv).to.not.be.empty;
            expect(vehicleRegistration.authTag).to.not.be.empty;
            expect(vehicleRegistration.vehicleregistration).to.be.equal(payload.vehicleregistration);
            scope.done();
        });
    });

    describe('getVehicleRegistration', () => {
        it('should get an existing vehicleRegistration', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                vehicleregistrationToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const vehicleRegistrationExample = 'vehicleRegistration-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/vehicleregistration/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedVehicleRegistration = security.aesEncrypt(vaultMasterKey, iv, vehicleRegistrationExample);
                    response.iv = encryptedVehicleRegistration.initializationVector;
                    response.authTag = encryptedVehicleRegistration.authenticationTag;
                    response.vehicleregistration = encryptedVehicleRegistration.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            const vehicleRegistration = await vault.vehicleRegistration.getVehicleRegistration(response.id);
            expect(vehicleRegistration).to.not.be.empty;
            expect(vehicleRegistration.id).to.not.be.empty;
            expect(vehicleRegistration.iv).to.not.be.empty;
            expect(vehicleRegistration.authTag).to.not.be.empty;
            expect(vehicleRegistration.vehicleregistration).to.be.equal(vehicleRegistrationExample);
            scope.done();
        });
    });

    describe('deleteVehicleRegistration', () => {
        it('should delete this specific vehicleRegistration', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vehicleRegistrationId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/vehicleregistration/${vehicleRegistrationId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            await vault.vehicleRegistration.deleteVehicleRegistration(vehicleRegistrationId);
            scope.done();
        });
    });
});

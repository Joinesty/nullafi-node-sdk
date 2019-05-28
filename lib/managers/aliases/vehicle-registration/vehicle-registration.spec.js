const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('VehicleRegistration Manager', () => {
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

    describe('createVehicleRegistration', () => {
        it('should create a new vehicleRegistration and return the vehicleRegistration', async () => {
            const security = new Security();
            const payload = {
                vehicleregistration: 'vehicleRegistration-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                vehicleregistrationToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
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
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const vehicleRegistration = await vault.vehicleRegistration.createVehicleRegistration(payload.vehicleregistration, payload.tags);
            expect(vehicleRegistration).to.not.be.empty;
            expect(vehicleRegistration.id).to.not.be.empty;
            expect(vehicleRegistration.iv).to.not.be.empty;
            expect(vehicleRegistration.authTag).to.not.be.empty;
            expect(vehicleRegistration.vehicleregistration).to.be.equal(payload.vehicleregistration);
        });
    });

    describe('retrieveVehicleRegistration', () => {
        it('should get an existing vehicleRegistration', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                vehicleregistrationToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const vehicleRegistrationExample = 'vehicleRegistration-example';

            nock(apiHost)
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
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const vehicleRegistration = await vault.vehicleRegistration.retrieveVehicleRegistration(response.id);
            expect(vehicleRegistration).to.not.be.empty;
            expect(vehicleRegistration.id).to.not.be.empty;
            expect(vehicleRegistration.iv).to.not.be.empty;
            expect(vehicleRegistration.authTag).to.not.be.empty;
            expect(vehicleRegistration.vehicleregistration).to.be.equal(vehicleRegistrationExample);
        });
    });

    describe('retrieveVehicleRegistrationFromRealData', () => {
        it('should get an existing vehicleregistration', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                vehicleregistrationToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const vehicleregistrationExample = 'vehicleregistration-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const vehicleregistrationHash = vault.hash(vehicleregistrationExample);

            nock(apiHost)
                .get(`/vault/static/vehicleregistration?hash=${encodeURIComponent(vehicleregistrationHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedVehicleRegistration = security.aesEncrypt(vaultMasterKey, iv, vehicleregistrationExample);
                    response.iv = encryptedVehicleRegistration.initializationVector;
                    response.authTag = encryptedVehicleRegistration.authenticationTag;
                    response.vehicleregistration = encryptedVehicleRegistration.encryptedData;
                    callback(null, [response]);
                });

            const vehicleregistrationList = await vault.vehicleRegistration
                .retrieveVehicleRegistrationFromRealData(vehicleregistrationExample, ['1', '2']);

            vehicleregistrationList.forEach((vehicleregistration) => {
                expect(vehicleregistration).to.not.be.empty;
                expect(vehicleregistration.id).to.not.be.empty;
                expect(vehicleregistration.iv).to.not.be.empty;
                expect(vehicleregistration.authTag).to.not.be.empty;
                expect(vehicleregistration.vehicleregistration).to.be.equal(vehicleregistrationExample);
            });
        });
    });

    describe('deleteVehicleRegistration', () => {
        it('should delete this specific vehicleRegistration', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vehicleRegistrationId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/vehicleregistration/${vehicleRegistrationId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.vehicleRegistration.deleteVehicleRegistration(vehicleRegistrationId);
        });
    });
});

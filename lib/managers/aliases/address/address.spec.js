const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('Address Manager', () => {
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

    describe('createAddress', () => {
        it('should create a new address and return the address', async () => {
            const security = new Security();
            const payload = {
                address: 'address-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                addressToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/address`, (body) => {
                    return body.address && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.address = body.address;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const address = await vault.address.createAddress(payload.address, payload.tags);
            expect(address).to.not.be.empty;
            expect(address.id).to.not.be.empty;
            expect(address.iv).to.not.be.empty;
            expect(address.authTag).to.not.be.empty;
            expect(address.address).to.be.equal(payload.address);
        });
    });

    describe('retrieveAddress', () => {
        it('should get an existing address', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                addressToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const addressExample = 'address-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/address/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedAddress = security.aesEncrypt(vaultMasterKey, iv, addressExample);
                    response.iv = encryptedAddress.initializationVector;
                    response.authTag = encryptedAddress.authenticationTag;
                    response.address = encryptedAddress.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const address = await vault.address.retrieveAddress(response.id);
            expect(address).to.not.be.empty;
            expect(address.id).to.not.be.empty;
            expect(address.iv).to.not.be.empty;
            expect(address.authTag).to.not.be.empty;
            expect(address.address).to.be.equal(addressExample);
        });
    });

    describe('deleteAddress', () => {
        it('should delete this specific address', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const addressId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/address/${addressId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.address.deleteAddress(addressId);
        });
    });
});

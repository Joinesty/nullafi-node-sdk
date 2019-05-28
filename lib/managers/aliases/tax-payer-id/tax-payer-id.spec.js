const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('TaxPayerID Manager', () => {
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

    describe('createTaxPayerID', () => {
        it('should create a new Taxpayerid and return the Taxpayerid', async () => {
            const security = new Security();
            const payload = {
                taxpayerid: 'Taxpayerid-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayeridToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/taxpayerid`, (body) => {
                    return body.taxpayerid && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.taxpayerid = body.taxpayerid;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const Taxpayerid = await vault.Taxpayerid.createTaxPayerID(payload.taxpayerid, payload.tags);
            expect(Taxpayerid).to.not.be.empty;
            expect(Taxpayerid.id).to.not.be.empty;
            expect(Taxpayerid.iv).to.not.be.empty;
            expect(Taxpayerid.authTag).to.not.be.empty;
            expect(Taxpayerid.taxpayerid).to.be.equal(payload.taxpayerid);
        });
    });

    describe('retrieveTaxPayerID', () => {
        it('should get an existing Taxpayerid', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayeridToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const taxPayerIdExample = 'Taxpayerid-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/taxpayerid/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedTaxPayerID = security.aesEncrypt(vaultMasterKey, iv, taxPayerIdExample);
                    response.iv = encryptedTaxPayerID.initializationVector;
                    response.authTag = encryptedTaxPayerID.authenticationTag;
                    response.taxpayerid = encryptedTaxPayerID.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const Taxpayerid = await vault.Taxpayerid.retrieveTaxPayerID(response.id);
            expect(Taxpayerid).to.not.be.empty;
            expect(Taxpayerid.id).to.not.be.empty;
            expect(Taxpayerid.iv).to.not.be.empty;
            expect(Taxpayerid.authTag).to.not.be.empty;
            expect(Taxpayerid.taxpayerid).to.be.equal(taxPayerIdExample);
        });
    });

    describe('retrieveTaxPayerIDFromRealData', () => {
        it('should get an existing taxpayerid', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayeridToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const taxpayeridExample = 'taxpayerid-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const taxpayeridHash = vault.hash(taxpayeridExample);

            nock(apiHost)
                .get(`/vault/static/taxpayerid?hash=${encodeURIComponent(taxpayeridHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedTaxPayerID = security.aesEncrypt(vaultMasterKey, iv, taxpayeridExample);
                    response.iv = encryptedTaxPayerID.initializationVector;
                    response.authTag = encryptedTaxPayerID.authenticationTag;
                    response.taxpayerid = encryptedTaxPayerID.encryptedData;
                    callback(null, [response]);
                });

            const taxpayeridList = await vault.Taxpayerid.retrieveTaxPayerIDFromRealData(taxpayeridExample, ['1', '2']);
            taxpayeridList.forEach((taxpayerid) => {
                expect(taxpayerid).to.not.be.empty;
                expect(taxpayerid.id).to.not.be.empty;
                expect(taxpayerid.iv).to.not.be.empty;
                expect(taxpayerid.authTag).to.not.be.empty;
                expect(taxpayerid.taxpayerid).to.be.equal(taxpayeridExample);
            });
        });
    });

    describe('deleteTaxPayerID', () => {
        it('should delete this specific Taxpayerid', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const taxPayerIdId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/taxpayerid/${taxPayerIdId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.Taxpayerid.deleteTaxPayerID(taxPayerIdId);
        });
    });
});

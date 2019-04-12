const nock = require('nock');
const StaticVault = require('./static-vault');
const Client = require('../client');
const Security = require('../services/security');
const { expect } = require('chai');

describe('TaxPayerID Manager', () => {
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

    describe('postTaxPayerID', () => {
        it('should create a new taxPayerId and return the taxPayerId', async () => {
            const security = new Security();
            const payload = {
                taxpayerid: 'taxPayerId-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayeridToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
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
            const vault = await StaticVault.getStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const taxPayerId = await vault.taxPayerId.postTaxPayerID(payload.taxpayerid, payload.tags);
            expect(taxPayerId).to.not.be.empty;
            expect(taxPayerId.id).to.not.be.empty;
            expect(taxPayerId.iv).to.not.be.empty;
            expect(taxPayerId.authTag).to.not.be.empty;
            expect(taxPayerId.taxpayerid).to.be.equal(payload.taxpayerid);
            scope.done();
        });
    });

    describe('getTaxPayerID', () => {
        it('should get an existing taxPayerId', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayeridToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const taxPayerIdExample = 'taxPayerId-example';

            const scope = nock(apiHost)
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
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            const taxPayerId = await vault.taxPayerId.getTaxPayerID(response.id);
            expect(taxPayerId).to.not.be.empty;
            expect(taxPayerId.id).to.not.be.empty;
            expect(taxPayerId.iv).to.not.be.empty;
            expect(taxPayerId.authTag).to.not.be.empty;
            expect(taxPayerId.taxpayerid).to.be.equal(taxPayerIdExample);
            scope.done();
        });
    });

    describe('deleteTaxPayerID', () => {
        it('should delete this specific taxPayerId', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const taxPayerIdId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/taxpayerid/${taxPayerIdId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            await vault.taxPayerId.deleteTaxPayerID(taxPayerIdId);
            scope.done();
        });
    });
});

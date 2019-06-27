const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('TaxPayer Manager', () => {
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

    describe('createTaxPayer', () => {
        it('should create a new taxPayer and return the taxPayer', async () => {
            const security = new Security();
            const payload = {
                taxpayer: 'taxPayer-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayerAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/taxpayer`, (body) => {
                    return body.taxpayer && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.taxpayer = body.taxpayer;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const taxPayer = await vault.taxPayer.createTaxPayer(payload.taxpayer, payload.tags);
            expect(taxPayer).to.not.be.empty;
            expect(taxPayer.id).to.not.be.empty;
            expect(taxPayer.iv).to.not.be.empty;
            expect(taxPayer.authTag).to.not.be.empty;
            expect(taxPayer.taxpayer).to.be.equal(payload.taxpayer);
        });
    });

    describe('retrieveTaxPayer', () => {
        it('should get an existing taxPayer', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayerAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const taxPayerIdExample = 'taxPayer-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/taxpayer/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedTaxPayer = security.aesEncrypt(vaultMasterKey, iv, taxPayerIdExample);
                    response.iv = encryptedTaxPayer.initializationVector;
                    response.authTag = encryptedTaxPayer.authenticationTag;
                    response.taxpayer = encryptedTaxPayer.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const taxPayer = await vault.taxPayer.retrieveTaxPayer(response.id);
            expect(taxPayer).to.not.be.empty;
            expect(taxPayer.id).to.not.be.empty;
            expect(taxPayer.iv).to.not.be.empty;
            expect(taxPayer.authTag).to.not.be.empty;
            expect(taxPayer.taxpayer).to.be.equal(taxPayerIdExample);
        });
    });

    describe('retrieveTaxPayerFromRealData', () => {
        it('should get an existing taxpayer', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                taxpayerAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const taxpayerExample = 'taxpayer-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const taxpayerHash = vault.hash(taxpayerExample);

            nock(apiHost)
                .get(`/vault/static/${vaultId}/taxpayer?hash=${encodeURIComponent(taxpayerHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedTaxPayer = security.aesEncrypt(vaultMasterKey, iv, taxpayerExample);
                    response.iv = encryptedTaxPayer.initializationVector;
                    response.authTag = encryptedTaxPayer.authenticationTag;
                    response.taxpayer = encryptedTaxPayer.encryptedData;
                    callback(null, [response]);
                });

            const taxpayerList = await vault.taxPayer.retrieveTaxPayerFromRealData(taxpayerExample, ['1', '2']);
            taxpayerList.forEach((taxpayer) => {
                expect(taxpayer).to.not.be.empty;
                expect(taxpayer.id).to.not.be.empty;
                expect(taxpayer.iv).to.not.be.empty;
                expect(taxpayer.authTag).to.not.be.empty;
                expect(taxpayer.taxpayer).to.be.equal(taxpayerExample);
            });
        });
    });

    describe('deleteTaxPayer', () => {
        it('should delete this specific taxPayer', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const taxPayerId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/taxpayer/${taxPayerId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.taxPayer.deleteTaxPayer(taxPayerId);
        });
    });
});

const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('SSN Manager', () => {
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

    describe('createSSN', () => {
        it('should create a new ssn and return the ssn', async () => {
            const security = new Security();
            const payload = {
                ssn: 'ssn-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                ssnToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/ssn`, (body) => {
                    return body.ssn && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.ssn = body.ssn;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const ssn = await vault.ssn.createSSN(payload.ssn, payload.tags);
            expect(ssn).to.not.be.empty;
            expect(ssn.id).to.not.be.empty;
            expect(ssn.iv).to.not.be.empty;
            expect(ssn.authTag).to.not.be.empty;
            expect(ssn.ssn).to.be.equal(payload.ssn);
            scope.done();
        });
    });

    describe('retrieveSSN', () => {
        it('should get an existing ssn', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                ssnToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const ssnExample = 'ssn-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/ssn/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedSSN = security.aesEncrypt(vaultMasterKey, iv, ssnExample);
                    response.iv = encryptedSSN.initializationVector;
                    response.authTag = encryptedSSN.authenticationTag;
                    response.ssn = encryptedSSN.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            const ssn = await vault.ssn.retrieveSSN(response.id);
            expect(ssn).to.not.be.empty;
            expect(ssn.id).to.not.be.empty;
            expect(ssn.iv).to.not.be.empty;
            expect(ssn.authTag).to.not.be.empty;
            expect(ssn.ssn).to.be.equal(ssnExample);
            scope.done();
        });
    });

    describe('deleteSSN', () => {
        it('should delete this specific ssn', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const ssnId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/ssn/${ssnId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            await vault.ssn.deleteSSN(ssnId);
            scope.done();
        });
    });
});

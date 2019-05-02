const nock = require('nock');
const StaticVault = require('../static-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('DateOfBirth Manager', () => {
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

    describe('postDateOfBirth', () => {
        it('should create a new dateOfBirth and return the dateOfBirth', async () => {
            const security = new Security();
            const payload = {
                dateofbirth: 'dateOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/dateofbirth`, (body) => {
                    return body.dateofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.dateofbirth = body.dateofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.postDateOfBirth(payload.dateofbirth, payload.tags);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(payload.dateofbirth);
            scope.done();
        });
    });

    describe('getDateOfBirth', () => {
        it('should get an existing dateOfBirth', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const dateOfBirthExample = 'dateOfBirth-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/dateofbirth/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedDateOfBirth = security.aesEncrypt(vaultMasterKey, iv, dateOfBirthExample);
                    response.iv = encryptedDateOfBirth.initializationVector;
                    response.authTag = encryptedDateOfBirth.authenticationTag;
                    response.dateofbirth = encryptedDateOfBirth.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.getDateOfBirth(response.id);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(dateOfBirthExample);
            scope.done();
        });
    });

    describe('deleteDateOfBirth', () => {
        it('should delete this specific dateOfBirth', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const dateOfBirthId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/dateofbirth/${dateOfBirthId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.getStaticVault(client, vaultId, vaultMasterKey);
            await vault.dateOfBirth.deleteDateOfBirth(dateOfBirthId);
            scope.done();
        });
    });
});

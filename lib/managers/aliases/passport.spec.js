const nock = require('nock');
const StaticVault = require('../static-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('Passport Manager', () => {
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

    describe('createPassport', () => {
        it('should create a new passport and return the passport', async () => {
            const security = new Security();
            const payload = {
                passport: 'passport-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                passportToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/static/${vaultId}/passport`, (body) => {
                    return body.passport && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.passport = body.passport;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const passport = await vault.passport.createPassport(payload.passport, payload.tags);
            expect(passport).to.not.be.empty;
            expect(passport.id).to.not.be.empty;
            expect(passport.iv).to.not.be.empty;
            expect(passport.authTag).to.not.be.empty;
            expect(passport.passport).to.be.equal(payload.passport);
            scope.done();
        });
    });

    describe('retrievePassport', () => {
        it('should get an existing passport', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                passportToken: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const passportExample = 'passport-example';

            const scope = nock(apiHost)
                .get(`/vault/static/${vaultId}/passport/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedPassport = security.aesEncrypt(vaultMasterKey, iv, passportExample);
                    response.iv = encryptedPassport.initializationVector;
                    response.authTag = encryptedPassport.authenticationTag;
                    response.passport = encryptedPassport.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            const passport = await vault.passport.retrievePassport(response.id);
            expect(passport).to.not.be.empty;
            expect(passport.id).to.not.be.empty;
            expect(passport.iv).to.not.be.empty;
            expect(passport.authTag).to.not.be.empty;
            expect(passport.passport).to.be.equal(passportExample);
            scope.done();
        });
    });

    describe('deletePassport', () => {
        it('should delete this specific passport', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const passportId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/static/${vaultId}/passport/${passportId}`)
                .reply(200);

            const client = new Client();
            const vault = await StaticVault.createStaticVault(client, vaultId, vaultMasterKey);
            await vault.passport.deletePassport(passportId);
            scope.done();
        });
    });
});

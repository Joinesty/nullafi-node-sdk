const nock = require('nock');
const CommunicationVault = require('../communication-vault');
const Client = require('../../client');
const Security = require('../../services/security');
const { expect } = require('chai');

describe('Email Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    let vaultScope = null;

    beforeEach(() => {
        const response = {
            id: 'd490157b23534215b0369a2685aab47f',
            name: 'Main communication vault for HR department',
            tags: ['tag', 'test'],
            createdAt: '2018-07-14 T01:00:00Z',
        };

        vaultScope = nock(apiHost)
            .get('/vault/communication/d490157b23534215b0369a2685aab47f')
            .reply(200, response);
    });

    afterEach(() => {
        vaultScope.done();
    });

    describe('postEmail', () => {
        it('should create a new email and return the email', async () => {
            const security = new Security();
            const payload = {
                email: 'email-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                emailToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .post(`/vault/communication/${vaultId}/email`, (body) => {
                    return body.email && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.email = body.email;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await CommunicationVault.getCommunicationVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const email = await vault.email.postEmail(payload.email, payload.tags);
            expect(email).to.not.be.empty;
            expect(email.id).to.not.be.empty;
            expect(email.iv).to.not.be.empty;
            expect(email.authTag).to.not.be.empty;
            expect(email.email).to.be.equal(payload.email);
            scope.done();
        });
    });

    describe('getEmail', () => {
        it('should get an existing email', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                emailToken: 'some-token',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const emailExample = 'email-example';

            const scope = nock(apiHost)
                .get(`/vault/communication/${vaultId}/email/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedEmail = security.aesEncrypt(vaultMasterKey, iv, emailExample);
                    response.iv = encryptedEmail.initializationVector;
                    response.authTag = encryptedEmail.authenticationTag;
                    response.email = encryptedEmail.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            const vault = await CommunicationVault.getCommunicationVault(client, vaultId, vaultMasterKey);
            const email = await vault.email.getEmail(response.id);
            expect(email).to.not.be.empty;
            expect(email.id).to.not.be.empty;
            expect(email.iv).to.not.be.empty;
            expect(email.authTag).to.not.be.empty;
            expect(email.email).to.be.equal(emailExample);
            scope.done();
        });
    });

    describe('deleteEmail', () => {
        it('should delete this specific email', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const emailId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            const scope = nock(apiHost)
                .delete(`/vault/communication/${vaultId}/email/${emailId}`)
                .reply(200);

            const client = new Client();
            const vault = await CommunicationVault.getCommunicationVault(client, vaultId, vaultMasterKey);
            await vault.email.deleteEmail(emailId);
            scope.done();
        });
    });
});

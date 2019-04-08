const nock = require('nock');
const Vault = require('./vault');
const Client = require('../client');
const { expect } = require('chai');

describe('Vault manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postCommunicationVault', () => {
        it('should get a response with vault body', async () => {
            const scope = nock(apiHost)
                .post('/vault/communication', {
                    name: 'Vault test',
                    publicKey: 'PUB KEY',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'fd90157b23534215b0369a2685aab47f',
                    name: 'Main vault for IT department',
                    createdAt: '2018-07-14 T01:00:00Z',
                    iv: 'WBULraGVFU/dL6dNi8Ioio/Y8dw=',
                    tags: ['tag', 'test'],
                    vaultMasterKey: 'fLZXNNR1xaccJhecDs5a6tEi9uBEGoicPFUcIVp3+MofquDzGLy9m/e/qz5s/9BaVeeqDwmyqBCy+EQ74X7TjQ==',
                    sessionKey: '5apZv4vV51eeIKED6ZrxHbN/spof1H2oLLXXgxOoFQpoD2Fmw8xbjqjVe//A2/4BwGp92IuMMZ4cmiL6pi5FLQ==',
                });

            const vault = new Vault(client);
            const response = await vault.postCommunicationVault('Vault test', 'PUB KEY', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.name).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            expect(response.iv).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.vaultMasterKey).to.not.be.empty;
            expect(response.sessionKey).to.not.be.empty;
            scope.done();
        });
    });
    describe('postStaticVault', () => {
        it('should get a response with vault body', async () => {
            const scope = nock(apiHost)
                .post('/vault/static', {
                    name: 'Vault test',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'fd90157b23534215b0369a2685aab47f',
                    name: 'Main vault for IT department',
                    createdAt: '2018-07-14 T01:00:00Z',
                    iv: 'WBULraGVFU/dL6dNi8Ioio/Y8dw=',
                    tags: ['tag', 'test'],
                    vaultMasterKey: 'fLZXNNR1xaccJhecDs5a6tEi9uBEGoicPFUcIVp3+MofquDzGLy9m/e/qz5s/9BaVeeqDwmyqBCy+EQ74X7TjQ==',
                });

            const vault = new Vault(client);
            const response = await vault.postStaticVault('Vault test', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.name).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            expect(response.iv).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.vaultMasterKey).to.not.be.empty;
            scope.done();
        });
    });
    describe('getCommunicationVault', () => {
        it('should get a response with vault body', async () => {
            const scope = nock(apiHost)
                .get('/vault/communication/fd90157b23534215b0369a2685aab47f')
                .reply(200, {
                    id: 'fd90157b23534215b0369a2685aab47f',
                    name: 'Main vault for IT department',
                    createdAt: '2018-07-14 T01:00:00Z',
                    tags: ['tag', 'test'],
                });

            const vault = new Vault(client);
            const response = await vault.getCommunicationVault('fd90157b23534215b0369a2685aab47f');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.name).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            scope.done();
        });
    });
    describe('getStaticVault', () => {
        it('should get a response with vault body', async () => {
            const scope = nock(apiHost)
                .get('/vault/static/fd90157b23534215b0369a2685aab47f')
                .reply(200, {
                    id: 'fd90157b23534215b0369a2685aab47f',
                    name: 'Main vault for IT department',
                    createdAt: '2018-07-14 T01:00:00Z',
                    tags: ['tag', 'test'],
                });

            const vault = new Vault(client);
            const response = await vault.getStaticVault('fd90157b23534215b0369a2685aab47f');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.name).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            scope.done();
        });
    });
});

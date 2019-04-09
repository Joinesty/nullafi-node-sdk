const nock = require('nock');
const NullafiSDK = require('./nullafi-node-sdk');
const { expect } = require('chai');

describe('Nullafi Node SDK service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('getClient', () => {
        it('should get a authenticated instance of the client', async () => {
            const scope = nock(apiHost)
                .post('/authentication/token', { apiKey: 'testKey'})
                .reply(200, { token: 'some-valid-token' });

            const sdk = new NullafiSDK('testKey');
            const client = await sdk.getClient();
            expect(client).to.exist;
            expect(client.sessionToken).to.be.equal('some-valid-token');
            scope.done();
        });
    });
});

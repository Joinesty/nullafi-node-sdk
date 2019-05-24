const nock = require('nock');
const NullafiSDK = require('./nullafi-node-sdk');
const { expect } = require('chai');

describe('Nullafi Node SDK service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('createClient', () => {
        it('should get an authenticated instance of the client', async () => {
            const scope = nock(apiHost)
                .post('/authentication/alias', { apiKey: 'testKey'})
                .reply(200, { alias: 'some-valid-alias' });

            const sdk = new NullafiSDK('testKey');
            const client = await sdk.createClient();
            expect(client).to.exist;
            expect(client.sessionToken).to.be.equal('some-valid-alias');
            scope.done();
        });
    });
});

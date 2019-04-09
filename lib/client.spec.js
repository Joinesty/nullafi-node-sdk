const nock = require('nock');
const Client = require('./client');
const { expect } = require('chai');

describe('Client service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('managers', () => {
        it('should all be instantiated', () => {
            const client = new Client('session token');
            expect(client._security).to.not.be.undefined.and.not.be.null;
            expect(client.address).to.not.be.undefined.and.not.be.null;
            expect(client.dateOfBirth).to.not.be.undefined.and.not.be.null;
            expect(client.driversLicense).to.not.be.undefined.and.not.be.null;
            expect(client.email).to.not.be.undefined.and.not.be.null;
            expect(client.gender).to.not.be.undefined.and.not.be.null;
            expect(client.passport).to.not.be.undefined.and.not.be.null;
            expect(client.placeOfBirth).to.not.be.undefined.and.not.be.null;
            expect(client.race).to.not.be.undefined.and.not.be.null;
            expect(client.random).to.not.be.undefined.and.not.be.null;
            expect(client.ssn).to.not.be.undefined.and.not.be.null;
            expect(client.taxPayerId).to.not.be.undefined.and.not.be.null;
            expect(client.vault).to.not.be.undefined.and.not.be.null;
            expect(client.vehicleRegistration).to.not.be.undefined.and.not.be.null;
        });
    });
    describe('authenticate', () => {
        it('should get a response with a valid property', async () => {
            const scope = nock(apiHost)
                .post('/authentication/token', { apiKey: 'testKey'})
                .reply(200, { token: 'some-valid-token' });

            const client = new Client('session key');
            const response = await client.authenticate('testKey');
            expect(response).to.exist;
            expect(response.token).to.be.equal('some-valid-token');
            expect(client.sessionToken).to.be.equal('some-valid-token');
            scope.done();
        });
    });
});

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
    describe('get', () => {
        it('should get a response with a valid property', async () => {
            const scope = nock(apiHost)
                .get('/test')
                .reply(200, { valid: true });

            const client = new Client('session token');
            const response = await client.get('/test');
            expect(response).to.exist;
            expect(response.valid).to.be.true;
            scope.done();
        });

        it('should parse query string correctly', async () => {
            const query = { query: true, array: [1, 2, 3] };
            const scope = nock(apiHost)
                .get('/test')
                .query(query)
                .reply(200, { valid: true });

            const client = new Client('session token');
            const response = await client.get('/test', query);
            expect(response).to.exist;
            expect(response.valid).to.be.true;
            scope.done();
        });

        it('should raise an error for invalid url', async () => {
            const scope = nock(apiHost)
                .get('/test2')
                .reply(404);

            const client = new Client('session token');
            try {
                await client.get('/test2');
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(404);
            }

            scope.done();
        });
    });

    describe('post', () => {
        it('should post an object and receive a response with a valid property', async () => {
            const scope = nock(apiHost)
                .post('/test', { name: 'test' })
                .reply(200, { valid: true });

            const client = new Client('session token');
            const response = await client.post('/test', { name: 'test' });
            expect(response).to.exist;
            expect(response.valid).to.be.true;
            scope.done();
        });

        it('should post an object and receive a response with a valid property', async () => {
            const scope = nock(apiHost)
                .post('/test2', { name: 'test' })
                .reply(400);

            const client = new Client('session token');
            try {
                await client.post('/test2', { name: 'test' });
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(400);
            }

            scope.done();
        });
    });

    describe('put', () => {
        it('should put an object and receive a response with a valid property', async () => {
            const scope = nock(apiHost)
                .put('/test', { name: 'test' })
                .reply(200, { valid: true });

            const client = new Client('session token');
            const response = await client.put('/test', { name: 'test' });
            expect(response).to.exist;
            expect(response.valid).to.be.true;
            scope.done();
        });

        it('should put an object and receive a response with a valid property', async () => {
            const scope = nock(apiHost)
                .put('/test2', { name: 'test' })
                .reply(400);

            const client = new Client('session token');
            try {
                await client.put('/test2', { name: 'test' });
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(400);
            }

            scope.done();
        });
    });

    describe('patch', () => {
        it('should put an object and receive a response with a valid property', async () => {
            const scope = nock(apiHost)
                .patch('/test', { name: 'test' })
                .reply(200, { valid: true });

            const client = new Client('session token');
            const response = await client.patch('/test', { name: 'test' });
            expect(response).to.exist;
            expect(response.valid).to.be.true;
            scope.done();
        });

        it('should put an object and receive a response with a valid property', async () => {
            const scope = nock(apiHost)
                .patch('/test2', { name: 'test' })
                .reply(400);

            const client = new Client('session token');
            try {
                await client.patch('/test2', { name: 'test' });
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(400);
            }

            scope.done();
        });
    });

    describe('delete', () => {
        it('should get a response with a valid property', async () => {
            const scope = nock(apiHost)
                .delete('/test/1')
                .reply(200, { valid: true });

            const client = new Client('session token');
            const response = await client.delete('/test/1');
            expect(response).to.exist;
            expect(response.valid).to.be.true;
            scope.done();
        });

        it('should raise an error for invalid url', async () => {
            const scope = nock(apiHost)
                .delete('/test2/1')
                .reply(404);

            const client = new Client('session token');
            try {
                await client.delete('/test2/1');
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(404);
            }

            scope.done();
        });
    });
});

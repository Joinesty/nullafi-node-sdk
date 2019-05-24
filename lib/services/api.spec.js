const nock = require('nock');
const API = require('./api');
const { expect } = require('chai');

describe('API service', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    describe('get', () => {
        it('should get a response with a valid property', async () => {
            nock(apiHost)
                .get('/test')
                .reply(200, { valid: true });

            const api = new API();
            const response = await api.get('/test');
            expect(response).to.exist;
            expect(response.valid).to.be.true;
        });

        it('should parse query string correctly', async () => {
            const query = { query: true, array: [1, 2, 3] };
            nock(apiHost)
                .get('/test')
                .query(query)
                .reply(200, { valid: true });

            const api = new API();
            const response = await api.get('/test', query);
            expect(response).to.exist;
            expect(response.valid).to.be.true;
        });

        it('should raise an error for invalid url', async () => {
            nock(apiHost)
                .get('/test2')
                .reply(404);

            const api = new API();
            try {
                await api.get('/test2');
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(404);
            }
        });
    });

    describe('post', () => {
        it('should post an object and receive a response with a valid property', async () => {
            nock(apiHost)
                .post('/test', { name: 'test' })
                .reply(200, { valid: true });

            const api = new API();
            api.sessionToken = 'bearer-alias-example';
            const response = await api.post('/test', { name: 'test' });
            expect(response).to.exist;
            expect(response.valid).to.be.true;
        });

        it('should post an object and receive a response with a valid property', async () => {
            nock(apiHost)
                .post('/test2', { name: 'test' })
                .reply(400);

            const api = new API();
            try {
                await api.post('/test2', { name: 'test' });
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(400);
            }
        });
    });

    describe('put', () => {
        it('should put an object and receive a response with a valid property', async () => {
            nock(apiHost)
                .put('/test', { name: 'test' })
                .reply(200, { valid: true });

            const api = new API();
            const response = await api.put('/test', { name: 'test' });
            expect(response).to.exist;
            expect(response.valid).to.be.true;
        });

        it('should put an object and receive a response with a valid property', async () => {
            nock(apiHost)
                .put('/test2', { name: 'test' })
                .reply(400);

            const api = new API();
            try {
                await api.put('/test2', { name: 'test' });
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(400);
            }
        });
    });

    describe('patch', () => {
        it('should put an object and receive a response with a valid property', async () => {
            nock(apiHost)
                .patch('/test', { name: 'test' })
                .reply(200, { valid: true });

            const api = new API();
            const response = await api.patch('/test', { name: 'test' });
            expect(response).to.exist;
            expect(response.valid).to.be.true;
        });

        it('should put an object and receive a response with a valid property', async () => {
            nock(apiHost)
                .patch('/test2', { name: 'test' })
                .reply(400);

            const api = new API();
            try {
                await api.patch('/test2', { name: 'test' });
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(400);
            }
        });
    });

    describe('delete', () => {
        it('should get a response with a valid property', async () => {
            nock(apiHost)
                .delete('/test/1')
                .reply(200, { valid: true });

            const api = new API();
            const response = await api.delete('/test/1');
            expect(response).to.exist;
            expect(response.valid).to.be.true;
        });

        it('should raise an error for invalid url', async () => {
            nock(apiHost)
                .delete('/test2/1')
                .reply(404);

            const api = new API();
            try {
                await api.delete('/test2/1');
            } catch (error) {
                expect(error).to.exist;
                expect(error.response).to.exist;
                expect(error.response.statusCode).to.be.equal(404);
            }
        });
    });
});

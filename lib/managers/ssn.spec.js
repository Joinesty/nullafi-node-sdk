const nock = require('nock');
const SSN = require('./ssn');
const Client = require('../client');
const { expect } = require('chai');

describe('SSN manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postSSN', () => {
        it('should get a response with tokenized ssn body', async () => {
            const scope = nock(apiHost)
                .post('/vault/static/d490157b23534215b0369a2685aab47f/ssn', {
                    ssn: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    ssn: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    ssnToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const ssn = new SSN(client);
            const response = await ssn.postSSN('d490157b23534215b0369a2685aab47f',
                'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.ssn).to.not.be.empty;
            expect(response.ssnToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getSSN', () => {
        it('should get a response with tokenized ssn body', async () => {
            const scope = nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f/ssn/b490157b23534215b0369a2685aab47f2')
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    ssn: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    ssnToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const ssn = new SSN(client);
            const response = await ssn.getSSN('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.ssn).to.not.be.empty;
            expect(response.ssnToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getSSN', () => {
        it('should get a response with tokenized ssn body', async () => {
            const scope = nock(apiHost)
                .delete('/vault/static/d490157b23534215b0369a2685aab47f/ssn/b490157b23534215b0369a2685aab47f2')
                .reply(200);

            const ssn = new SSN(client);
            const response = await ssn.deleteSSN('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.be.empty;
            scope.done();
        });
    });
});

const nock = require('nock');
const DateOfBirth = require('./date-of-birth');
const Client = require('../client');
const { expect } = require('chai');

describe('DateOfBirth manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postDateOfBirth', () => {
        it('should get a response with tokenized dateofbirth body', async () => {
            const scope = nock(apiHost)
                .post('/vault/static/d490157b23534215b0369a2685aab47f/dateofbirth', {
                    dateofbirth: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    dateofbirth: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    dateofbirthToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const dateofbirth = new DateOfBirth(client);
            const response = await dateofbirth.postDateOfBirth('d490157b23534215b0369a2685aab47f',
                'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.dateofbirth).to.not.be.empty;
            expect(response.dateofbirthToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getDateOfBirth', () => {
        it('should get a response with tokenized dateofbirth body', async () => {
            const scope = nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f/dateofbirth/b490157b23534215b0369a2685aab47f2')
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    dateofbirth: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    dateofbirthToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const dateofbirth = new DateOfBirth(client);
            const response = await dateofbirth.getDateOfBirth('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.dateofbirth).to.not.be.empty;
            expect(response.dateofbirthToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getDateOfBirth', () => {
        it('should get a response with tokenized dateofbirth body', async () => {
            const scope = nock(apiHost)
                .delete('/vault/static/d490157b23534215b0369a2685aab47f/dateofbirth/b490157b23534215b0369a2685aab47f2')
                .reply(200);

            const dateofbirth = new DateOfBirth(client);
            const response = await dateofbirth.deleteDateOfBirth('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.be.empty;
            scope.done();
        });
    });
});

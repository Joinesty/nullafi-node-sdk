const nock = require('nock');
const Email = require('./email');
const Client = require('../client');
const { expect } = require('chai');

describe('Email manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postEmail', () => {
        it('should get a response with tokenized email body', async () => {
            const scope = nock(apiHost)
                .post('/vault/communication/d490157b23534215b0369a2685aab47f/email', {
                    emailAddress: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    emailAddress: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    emailToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const email = new Email(client);
            const response = await email.postEmail('d490157b23534215b0369a2685aab47f',
                'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.emailAddress).to.not.be.empty;
            expect(response.emailToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getEmail', () => {
        it('should get a response with tokenized email body', async () => {
            const scope = nock(apiHost)
                .get('/vault/communication/d490157b23534215b0369a2685aab47f/email/b490157b23534215b0369a2685aab47f2')
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    emailAddress: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    emailToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const email = new Email(client);
            const response = await email.getEmail('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.emailAddress).to.not.be.empty;
            expect(response.emailToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getEmail', () => {
        it('should get a response with tokenized email body', async () => {
            const scope = nock(apiHost)
                .delete('/vault/communication/d490157b23534215b0369a2685aab47f/email/b490157b23534215b0369a2685aab47f2')
                .reply(200);

            const email = new Email(client);
            const response = await email.deleteEmail('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.be.empty;
            scope.done();
        });
    });
});

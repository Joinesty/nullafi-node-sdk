const nock = require('nock');
const Race = require('./race');
const Client = require('../client');
const { expect } = require('chai');

describe('Race manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postRace', () => {
        it('should get a response with tokenized race body', async () => {
            const scope = nock(apiHost)
                .post('/vault/static/d490157b23534215b0369a2685aab47f/race', {
                    race: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    race: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    raceToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const race = new Race(client);
            const response = await race.postRace('d490157b23534215b0369a2685aab47f',
                'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.race).to.not.be.empty;
            expect(response.raceToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getRace', () => {
        it('should get a response with tokenized race body', async () => {
            const scope = nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f/race/b490157b23534215b0369a2685aab47f2')
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    race: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    raceToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const race = new Race(client);
            const response = await race.getRace('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.race).to.not.be.empty;
            expect(response.raceToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getRace', () => {
        it('should get a response with tokenized race body', async () => {
            const scope = nock(apiHost)
                .delete('/vault/static/d490157b23534215b0369a2685aab47f/race/b490157b23534215b0369a2685aab47f2')
                .reply(200);

            const race = new Race(client);
            const response = await race.deleteRace('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.be.empty;
            scope.done();
        });
    });
});

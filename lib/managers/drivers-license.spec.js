const nock = require('nock');
const DriversLicense = require('./drivers-license');
const Client = require('../client');
const { expect } = require('chai');

describe('DriversLicense manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postDriversLicense', () => {
        it('should get a response with tokenized driverslicense body', async () => {
            const scope = nock(apiHost)
                .post('/vault/static/d490157b23534215b0369a2685aab47f/driverslicense', {
                    driverslicense: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    driverslicense: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    driverslicenseToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const driverslicense = new DriversLicense(client);
            const response = await driverslicense.postDriversLicense('d490157b23534215b0369a2685aab47f',
                'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.driverslicense).to.not.be.empty;
            expect(response.driverslicenseToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getDriversLicense', () => {
        it('should get a response with tokenized driverslicense body', async () => {
            const scope = nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f/driverslicense/b490157b23534215b0369a2685aab47f2')
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    driverslicense: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    driverslicenseToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const driverslicense = new DriversLicense(client);
            const response = await driverslicense.getDriversLicense('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.driverslicense).to.not.be.empty;
            expect(response.driverslicenseToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getDriversLicense', () => {
        it('should get a response with tokenized driverslicense body', async () => {
            const scope = nock(apiHost)
                .delete('/vault/static/d490157b23534215b0369a2685aab47f/driverslicense/b490157b23534215b0369a2685aab47f2')
                .reply(200);

            const driverslicense = new DriversLicense(client);
            const response = await driverslicense.deleteDriversLicense('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.be.empty;
            scope.done();
        });
    });
});

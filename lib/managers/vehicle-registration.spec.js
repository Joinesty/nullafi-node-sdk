const nock = require('nock');
const VehicleRegistration = require('./vehicle-registration');
const Client = require('../client');
const { expect } = require('chai');

describe('VehicleRegistration manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';
    const client = new Client('session token');
    describe('postVehicleRegistration', () => {
        it('should get a response with tokenized vehicleregistration body', async () => {
            const scope = nock(apiHost)
                .post('/vault/static/d490157b23534215b0369a2685aab47f/vehicleregistration', {
                    vehicleregistration: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    tags: ['tag', 'test'],
                })
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    vehicleregistration: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    vehicleregistrationToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const vehicleregistration = new VehicleRegistration(client);
            const response = await vehicleregistration.postVehicleRegistration('d490157b23534215b0369a2685aab47f',
                'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=', ['tag', 'test']);
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.vehicleregistration).to.not.be.empty;
            expect(response.vehicleregistrationToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getVehicleRegistration', () => {
        it('should get a response with tokenized vehicleregistration body', async () => {
            const scope = nock(apiHost)
                .get('/vault/static/d490157b23534215b0369a2685aab47f/vehicleregistration/b490157b23534215b0369a2685aab47f2')
                .reply(200, {
                    id: 'b490157b23534215b0369a2685aab47f2',
                    vehicleregistration: 'blssVzRzdnP9uEi5WDrFGW7y0JELl7aLKMyKeOyChlk=',
                    vehicleregistrationToken: 'rsykjpkowjylkl@fipale.com',
                    tags: ['tag1', 'tag2'],
                    createdAt: '2018-07-14 T01:00:00Z',
                });

            const vehicleregistration = new VehicleRegistration(client);
            const response = await vehicleregistration
                .getVehicleRegistration('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.exist;
            expect(response.id).to.not.be.empty;
            expect(response.vehicleregistration).to.not.be.empty;
            expect(response.vehicleregistrationToken).to.not.be.empty;
            expect(response.tags).to.not.be.empty;
            expect(response.createdAt).to.not.be.empty;
            scope.done();
        });
    });
    describe('getVehicleRegistration', () => {
        it('should get a response with tokenized vehicleregistration body', async () => {
            const scope = nock(apiHost)
                .delete('/vault/static/d490157b23534215b0369a2685aab47f/vehicleregistration/b490157b23534215b0369a2685aab47f2')
                .reply(200);

            const vehicleregistration = new VehicleRegistration(client);
            const response = await vehicleregistration
                .deleteVehicleRegistration('d490157b23534215b0369a2685aab47f', 'b490157b23534215b0369a2685aab47f2');
            expect(response).to.be.empty;
            scope.done();
        });
    });
});

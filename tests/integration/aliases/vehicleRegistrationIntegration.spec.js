const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('VehicleRegistration Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'VehicleRegistration integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.vehicleRegistration.createVehicleRegistration(`${tokenName} token`);
        const tokenReturned = await staticVault.vehicleRegistration.retrieveVehicleRegistration(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.vehicleRegistration.retrieveVehicleRegistrationFromRealData(`${tokenName} token`);

        await staticVault.vehicleRegistration.deleteVehicleRegistration(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.vehicleRegistration).to.be.equal(tokenReturned.vehicleRegistration);
        expect(tokenReturned.vehicleRegistrationAlias).to.be.equal(tokenReturned.vehicleRegistrationAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

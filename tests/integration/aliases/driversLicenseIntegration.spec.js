const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('DriversLicense Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'DriversLicense integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.driversLicense.createDriversLicense(`${tokenName} token`);
        const tokenReturned = await staticVault.driversLicense.retrieveDriversLicense(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.driversLicense.retrieveDriversLicenseFromRealData(`${tokenName} token`);

        await staticVault.driversLicense.deleteDriversLicense(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.driversLicense).to.be.equal(tokenReturned.driversLicense);
        expect(tokenReturned.driversLicenseAlias).to.be.equal(tokenReturned.driversLicenseAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

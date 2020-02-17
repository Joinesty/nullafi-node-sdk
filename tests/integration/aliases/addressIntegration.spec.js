const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Address Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Address integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.address.createAddress(`${tokenName} token`);
        const tokenReturned = await staticVault.address.retrieveAddress(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.address.retrieveAddressFromRealData(`${tokenName} token`);

        await staticVault.address.deleteAddress(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.address).to.be.equal(tokenReturned.address);
        expect(tokenReturned.addressAlias).to.be.equal(tokenReturned.addressAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

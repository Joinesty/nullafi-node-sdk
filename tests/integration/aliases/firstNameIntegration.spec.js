const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('FirstName Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'FirstName integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.firstName.createFirstName(`${tokenName} token`);
        const tokenReturned = await staticVault.firstName.retrieveFirstName(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.firstName.retrieveFirstNameFromRealData(`${tokenName} token`);

        await staticVault.firstName.deleteFirstName(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.firstName).to.be.equal(tokenReturned.firstName);
        expect(tokenReturned.firstNameAlias).to.be.equal(tokenReturned.firstNameAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

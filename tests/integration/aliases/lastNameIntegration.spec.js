const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('LastName Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'LastName integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.lastName.createLastName(`${tokenName} token`);
        const tokenReturned = await staticVault.lastName.retrieveLastName(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.lastName.retrieveLastNameFromRealData(`${tokenName} token`);

        await staticVault.lastName.deleteLastName(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.lastName).to.be.equal(tokenReturned.lastName);
        expect(tokenReturned.lastNameAlias).to.be.equal(tokenReturned.lastNameAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

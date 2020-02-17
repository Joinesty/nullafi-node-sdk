const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('DateOfBirth Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'DateOfBirth integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.dateOfBirth.createDateOfBirth(`${tokenName} token`);
        const tokenReturned = await staticVault.dateOfBirth.retrieveDateOfBirth(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.dateOfBirth.retrieveDateOfBirthFromRealData(`${tokenName} token`);

        await staticVault.dateOfBirth.deleteDateOfBirth(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.dateOfBirth).to.be.equal(tokenReturned.dateOfBirth);
        expect(tokenReturned.dateOfBirthAlias).to.be.equal(tokenReturned.dateOfBirthAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

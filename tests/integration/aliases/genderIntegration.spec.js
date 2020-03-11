const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Gender Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Gender integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.gender.createGender(`${tokenName} token`);
        const tokenReturned = await staticVault.gender.retrieveGender(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.gender.retrieveGenderFromRealData(`${tokenName} token`);

        await staticVault.gender.deleteGender(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.gender).to.be.equal(tokenReturned.gender);
        expect(tokenReturned.genderAlias).to.be.equal(tokenReturned.genderAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

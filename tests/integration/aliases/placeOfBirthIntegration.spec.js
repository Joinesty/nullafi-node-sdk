const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('PlaceOfBirth Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'PlaceOfBirth integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.placeOfBirth.createPlaceOfBirth(`${tokenName} token`);
        const tokenReturned = await staticVault.placeOfBirth.retrievePlaceOfBirth(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.placeOfBirth.retrievePlaceOfBirthFromRealData(`${tokenName} token`);

        await staticVault.placeOfBirth.deletePlaceOfBirth(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.placeOfBirth).to.be.equal(tokenReturned.placeOfBirth);
        expect(tokenReturned.placeOfBirthAlias).to.be.equal(tokenReturned.placeOfBirthAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Race Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Race integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.race.createRace(`${tokenName} token`);
        const tokenReturned = await staticVault.race.retrieveRace(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.race.retrieveRaceFromRealData(`${tokenName} token`);

        await staticVault.race.deleteRace(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.race).to.be.equal(tokenReturned.race);
        expect(tokenReturned.raceAlias).to.be.equal(tokenReturned.raceAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

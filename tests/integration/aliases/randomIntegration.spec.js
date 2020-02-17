const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Random Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Random integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.random.createRandom(`${tokenName} token`);
        const tokenReturned = await staticVault.random.retrieveRandom(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.random.retrieveRandomFromRealData(`${tokenName} token`);

        await staticVault.random.deleteRandom(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.data).to.be.equal(tokenReturned.data);
        expect(tokenReturned.alias).to.be.equal(tokenReturned.alias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Generic Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Generic integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.generic.createGeneric(`${tokenName} token`, '\d{4}');
        const tokenReturned = await staticVault.generic.retrieveGeneric(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.generic.retrieveGenericFromRealData(`${tokenName} token`);

        await staticVault.generic.deleteGeneric(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.generic).to.be.equal(tokenReturned.generic);
        expect(tokenReturned.genericAlias).to.be.equal(tokenReturned.genericAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

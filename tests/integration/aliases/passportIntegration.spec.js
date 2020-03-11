const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Passport Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Passport integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.passport.createPassport(`${tokenName} token`);
        const tokenReturned = await staticVault.passport.retrievePassport(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.passport.retrievePassportFromRealData(`${tokenName} token`);

        await staticVault.passport.deletePassport(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.passport).to.be.equal(tokenReturned.passport);
        expect(tokenReturned.passportAlias).to.be.equal(tokenReturned.passportAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

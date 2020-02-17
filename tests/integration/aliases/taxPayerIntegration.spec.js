const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('TaxPayer Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'TaxPayer integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.taxPayer.createTaxPayer(`${tokenName} token`);
        const tokenReturned = await staticVault.taxPayer.retrieveTaxPayer(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.taxPayer.retrieveTaxPayerFromRealData(`${tokenName} token`);

        await staticVault.taxPayer.deleteTaxPayer(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.taxPayer).to.be.equal(tokenReturned.taxPayer);
        expect(tokenReturned.taxPayerAlias).to.be.equal(tokenReturned.taxPayerAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('SSN Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'SSN integration';
        const staticVault = await client.createStaticVault(`${tokenName} vault`);

        const tokenCreated = await staticVault.ssn.createSSN(`${tokenName} token`);
        const tokenReturned = await staticVault.ssn.retrieveSSN(tokenCreated.id);
        const tokenReturnedFromRealData = await staticVault.ssn.retrieveSSNFromRealData(`${tokenName} token`);

        await staticVault.ssn.deleteSSN(tokenCreated.id);
        await client.deleteStaticVault(staticVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.ssn).to.be.equal(tokenReturned.ssn);
        expect(tokenReturned.ssnAlias).to.be.equal(tokenReturned.ssnAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

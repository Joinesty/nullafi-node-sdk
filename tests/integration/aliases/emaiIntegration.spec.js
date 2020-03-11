const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Email Token', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);

        const tokenName = 'Email integration';
        const communicationVault = await client.createCommunicationVault(`${tokenName} vault`);

        const tokenCreated = await communicationVault.email.createEmail(`${tokenName} token`);
        const tokenReturned = await communicationVault.email.retrieveEmail(tokenCreated.id);
        const tokenReturnedFromRealData = await communicationVault.email.retrieveEmailFromRealData(`${tokenName} token`);

        await communicationVault.email.deleteEmail(tokenCreated.id);
        await client.deleteCommunicationVault(communicationVault.id);

        expect(tokenCreated.id).to.be.equal(tokenReturned.id);
        expect(tokenReturned.email).to.be.equal(tokenReturned.email);
        expect(tokenReturned.emailAlias).to.be.equal(tokenReturned.emailAlias);
        expect(tokenReturnedFromRealData.length).to.be.greaterThan(0);
    });
});

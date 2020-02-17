const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Communication Vault', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);
        const name = 'Node.js - Sample Communication Vault Name';
        const vaultCreated = await client.createCommunicationVault(name);
        const vaultReturned = await client.retrieveCommunicationVault(vaultCreated.id, vaultCreated.masterKey);
        await client.deleteCommunicationVault(vaultCreated.id);

        expect(vaultCreated.id).to.be.equal(vaultReturned.id);
        expect(vaultCreated.name).to.be.equal(vaultReturned.name);
    });
});

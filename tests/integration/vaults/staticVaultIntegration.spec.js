const Client = require('../../../lib/client');
const { expect } = require('chai');

describe('Static Vault', () => {
    it('should run Integration Tests', async () => {
        const client = new Client();
        await client.authenticate(process.env.API_KEY);
        const name = 'Node.js - Sample Static Vault Name';
        const vaultCreated = await client.createStaticVault(name);
        const vaultReturned = await client.retrieveStaticVault(vaultCreated.id, vaultCreated.masterKey);
        await client.deleteStaticVault(vaultCreated.id);

        expect(vaultCreated.id).to.be.equal(vaultReturned.id);
        expect(vaultCreated.name).to.be.equal(vaultReturned.name);
    });
});

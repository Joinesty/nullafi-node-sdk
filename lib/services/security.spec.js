const Security = require('./security');
const { expect } = require('chai');

describe('Security service', () => {
    describe('generateEphemeralKeypairs', () => {
        it('should return an object with the public and private key', async () => {
            const security = new Security();
            const keyPairs = await security.generateEphemeralKeypairs('random pass phrase');
            expect(keyPairs).to.exist;
            expect(keyPairs.publicKey).to.not.be.empty;
            expect(keyPairs.privateKey).to.not.be.empty;
        });
    });

    describe('encrypt', () => {
        it('should return a base64 with the encrypted data using the public key', async () => {
            const security = new Security();
            const keyPairs = await security.generateEphemeralKeypairs('random passphrase');
            const testData = { test: 'some data to be encrypted' };
            const encryptedData = security.encrypt(keyPairs.publicKey, testData);
            expect(encryptedData).to.not.be.empty;
        });
    });

    describe('decrypt', () => {
        it('should return an object with the decrypted data using the private key', async () => {
            const security = new Security();
            const passphrase = 'random passphrase';
            const keyPairs = await security.generateEphemeralKeypairs(passphrase);
            const testData = { test: 'some data to be encrypted' };
            const encryptedData = security.encrypt(keyPairs.publicKey, { test: 'some data to be encrypted' });
            const decryptedData = security.decrypt({ key: keyPairs.privateKey, passphrase }, encryptedData);
            expect(decryptedData).to.be.deep.equal(testData);
        });
    });
});

const Security = require('./security');
const { expect } = require('chai');

describe('Security service', () => {
    describe('rsaGenerateEphemeralKeypairs', () => {
        it('should return an object with the public and private key', async () => {
            const security = new Security();
            const keyPairs = await security.rsaGenerateEphemeralKeypairs('random pass phrase');
            expect(keyPairs).to.exist;
            expect(keyPairs.publicKey).to.not.be.empty;
            expect(keyPairs.privateKey).to.not.be.empty;
        });
    });

    describe('rsaPublicEncrypt', () => {
        it('should return a base64 with the encrypted data using the public key', async () => {
            const security = new Security();
            const keyPairs = await security.rsaGenerateEphemeralKeypairs('random passphrase');
            const testData = { test: 'some data to be encrypted' };
            const encryptedData = security.rsaPublicEncrypt(keyPairs.publicKey, testData);
            expect(encryptedData).to.not.be.empty;
        });
    });

    describe('rsaPrivateDecrypt', () => {
        it('should return an object with the decrypted data using the private key', async () => {
            const security = new Security();
            const passphrase = 'random passphrase';
            const keyPairs = await security.rsaGenerateEphemeralKeypairs(passphrase);
            const testData = { test: 'some data to be encrypted' };
            const encryptedData = security.rsaPublicEncrypt(keyPairs.publicKey, { test: 'some data to be encrypted' });
            const decryptedData = security.rsaPrivateDecrypt({ key: keyPairs.privateKey, passphrase }, encryptedData);
            expect(decryptedData).to.be.deep.equal(testData);
        });
    });

    describe('aesGenerateMasterKey', () => {
        it('should return a string to be used as AES encryption masterkey', async () => {
            const security = new Security();
            const masterKey = await security.aesGenerateMasterKey();
            expect(masterKey).to.not.be.empty;
        });
    });

    describe('aesGenerateInitializationVector', () => {
        it('should return a string to be used as AES encryption initialization vector', async () => {
            const security = new Security();
            const initializationVector = await security.aesGenerateInitializationVector();
            expect(initializationVector).to.not.be.empty;
        });
    });

    describe('aesEncrypt', () => {
        it('should return an AES encrypted data', async () => {
            const security = new Security();
            const masterKey = security.aesGenerateMasterKey();
            const initializationVector = security.aesGenerateInitializationVector();
            const result = security.aesEncrypt(masterKey, initializationVector, JSON.stringify({ test: 'data to be encrypted' }));
            expect(result).to.not.be.empty;
            expect(result.encryptedData).to.not.be.empty;
            expect(result.initializationVector).to.not.be.empty;
            expect(result.authenticationTag).to.not.be.empty;
        });
    });

    describe('aesEncrypt', () => {
        it('should return an AES encrypted data', async () => {
            const security = new Security();
            const masterKey = security.aesGenerateMasterKey();
            const initializationVector = security.aesGenerateInitializationVector();
            const testData = JSON.stringify({ test: 'data to be encrypted' });
            const result = security.aesEncrypt(masterKey, initializationVector, testData);
            const unencryptedData = security.aesDecrypt(masterKey, result.initializationVector, result.authenticationTag, result.encryptedData);
            expect(unencryptedData).to.be.equal(testData);
        });
    });
});

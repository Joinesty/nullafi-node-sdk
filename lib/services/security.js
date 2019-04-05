
const { promisify } = require('util');
const { generateKeyPair, publicEncrypt, privateDecrypt } = require('crypto');

/**
 *
 *
 * @export
 * @class Security
 */
module.exports = class Security {
    /**
     *  Encrypt object to a base64 string using a public key
     *
     * @param {string} publicKey
     * @param {Object} data
     * @return {string}
     * @memberof Security
     */
    encrypt(publicKey, data) {
        return publicEncrypt(publicKey, Buffer.from(JSON.stringify(data))).toString('base64');
    }
    /**
         *  Decrypt object to a base64 string using a private key
         *
         * @param {string} privateKey
         * @param {Object} base64EncryptedData
         * @return {string}
         * @memberof Security
         */
    decrypt(privateKey, base64EncryptedData) {
        const decryptedBuffer = privateDecrypt(privateKey, Buffer.from(base64EncryptedData, 'base64'));
        return JSON.parse(decryptedBuffer.toString());
    }
    /**
     * Generate a ephemeral key to allow encrypted communication between the SDK and API
     *
     * @param {string} passphrase
     * @return {Promise<Object>}
     * @memberof Security
     */
    generateEphemeralKeypairs(passphrase) {
        return promisify(generateKeyPair)('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passphrase,
            },
        });
    }
};

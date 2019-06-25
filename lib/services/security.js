
const crypto = require('crypto');
const util = require('util');

/**
 *
 *
 * @export
 * @class Security
 * @private
 */
class Security {
    /**
             * Generate a hash for the real data
             *
             * @param {string} value
             * @param {string} secret
             * @return {string}
             * @memberof Security
             */
    hmacHash(value, secret) {
        return crypto.createHmac('sha256', secret).update(value).digest('base64');
    }
    /**
         * Generate a ephemeral key to allow encrypted communication between the SDK and API
         *
         * @param {string} passphrase
         * @return {Promise<Object>}
         * @memberof Security
         */
    rsaGenerateEphemeralKeypairs(passphrase) {
        return util.promisify(crypto.generateKeyPair)('rsa', {
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
    /**
     *  Encrypt object to a base64 string using a public key
     *
     * @param {string} publicKey
     * @param {Object} data
     * @return {string}
     * @memberof Security
     */
    rsaPublicEncrypt(publicKey, data) {
        return crypto.publicEncrypt(publicKey, Buffer.from(JSON.stringify(data))).toString('base64');
    }
    /**
         *  Decrypt object to a base64 string using a private key
         *
         * @param {string} privateKey
         * @param {Object} base64EncryptedData
         * @return {string}
         * @memberof Security
         */
    rsaPrivateDecrypt(privateKey, base64EncryptedData) {
        const decryptedBuffer = crypto.privateDecrypt(privateKey, Buffer.from(base64EncryptedData, 'base64'));
        return JSON.parse(decryptedBuffer.toString());
    }
    /**
     * Generate masterkey to be used on AES encrypt/decrypt
     *
     * @return {string}
     */
    aesGenerateMasterKey() {
        return crypto.randomBytes(32).toString('base64');
    }
    /**
     *  Generate initialization vector to be used on AES encrypt/decrypt
     *
     * @return {string}
     */
    aesGenerateInitializationVector() {
        return crypto.randomBytes(16).toString('base64');
    }
    /**
     * Encrypt the data using AES GCM 256bit
     *
     * @param {string} masterKey
     * @param {string} initializationVector
     * @param {string} data
     * @return {string}
     */
    aesEncrypt(masterKey, initializationVector, data) {
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'base64'), Buffer.from(initializationVector, 'base64'));
        let enc = cipher.update(data, 'utf8', 'base64');
        enc += cipher.final('base64');

        return {
            encryptedData: enc,
            initializationVector,
            authenticationTag: cipher.getAuthTag().toString('base64'),
        };
    }

    /**
     * Decrypt the data using AES GCM 256bit
     *
     * @param {string} masterKey
     * @param {string} initializationVector
     * @param {string} authTag
     * @param {string} base64EncryptedData
     * @return {string}
     */
    aesDecrypt(masterKey, initializationVector, authTag, base64EncryptedData) {
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(masterKey, 'base64'), Buffer.from(initializationVector, 'base64'));
        decipher.setAuthTag(Buffer.from(authTag, 'base64'));
        let str = decipher.update(base64EncryptedData, 'base64', 'utf8');
        str += decipher.final('utf8');
        return str;
    }
};

module.exports = Security;

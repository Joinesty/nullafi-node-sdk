import { generateKeyPair } from 'crypto';


/**
 *
 *
 * @export
 * @class Security
 */
export default class Security {
    /**
     * Generate a ephemeral key to allow encrypted communication between the SDK and API
     *
     * @param {string} passphrase
     * @return {Promise<Object>}
     * @memberof Security
     */
    generateEphemeralKeypairs(passphrase) {
        return new Promise((resolve, reject) => {
            generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase,
                },
            }, (err, publicKey, privateKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ publicKey, privateKey });
                }
            });
        });
    }
}

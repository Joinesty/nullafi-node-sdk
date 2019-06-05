const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('DateOfBirth Manager', () => {
    const apiHost = 'https://enterprise-api.nullafi.com';

    beforeEach(() => {
        const response = {
            id: 'd490157b23534215b0369a2685aab47f',
            name: 'Main static vault for HR department',
            tags: ['tag', 'test'],
            createdAt: '2018-07-14 T01:00:00Z',
        };

        nock(apiHost)
            .get('/vault/static/d490157b23534215b0369a2685aab47f')
            .reply(200, response);
    });

    describe('createDateOfBirth', () => {
        it('should create a new dateOfBirth and return the dateOfBirth', async () => {
            const security = new Security();
            const payload = {
                dateofbirth: 'dateOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/dateofbirth`, (body) => {
                    return body.dateofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.dateofbirth = body.dateofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.createDateOfBirth(payload.dateofbirth, payload.tags);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(payload.dateofbirth);
        });
    });

    describe('createDateOfBirth (with optional parameters)', () => {
        it('should create a new dateOfBirth and return the dateOfBirth', async () => {
            const security = new Security();
            const payload = {
                dateofbirth: 'dateOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/dateofbirth`, (body) => {
                    return body.dateofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.dateofbirth = body.dateofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.createDateOfBirth(payload.dateofbirth, payload.tags);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(payload.dateofbirth);
        });
    });

    describe('createDateOfBirth (with optional year)', () => {
        it('should create a new dateOfBirth and return the dateOfBirth', async () => {
            const security = new Security();
            const payload = {
                dateofbirth: 'dateOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/dateofbirth?year=1990&`, (body) => {
                    return body.dateofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.dateofbirth = body.dateofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.createDateOfBirth(payload.dateofbirth, 1990, payload.tags);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(payload.dateofbirth);
        });
    });

    describe('createDateOfBirth (with optional month)', () => {
        it('should create a new dateOfBirth and return the dateOfBirth', async () => {
            const security = new Security();
            const payload = {
                dateofbirth: 'dateOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/dateofbirth?month=10`, (body) => {
                    return body.dateofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.dateofbirth = body.dateofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.createDateOfBirth(payload.dateofbirth, 10, payload.tags);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(payload.dateofbirth);
        });
    });

    describe('createDateOfBirth (with optional year and month)', () => {
        it('should create a new dateOfBirth and return the dateOfBirth', async () => {
            const security = new Security();
            const payload = {
                dateofbirth: 'dateOfBirth-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/dateofbirth?year=1990&month=10`, (body) => {
                    return body.dateofbirth && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.dateofbirth = body.dateofbirth;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.createDateOfBirth(payload.dateofbirth, 1990, 10, payload.tags);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(payload.dateofbirth);
        });
    });

    describe('retrieveDateOfBirth', () => {
        it('should get an existing dateOfBirth', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const dateOfBirthExample = 'dateOfBirth-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/dateofbirth/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedDateOfBirth = security.aesEncrypt(vaultMasterKey, iv, dateOfBirthExample);
                    response.iv = encryptedDateOfBirth.initializationVector;
                    response.authTag = encryptedDateOfBirth.authenticationTag;
                    response.dateofbirth = encryptedDateOfBirth.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const dateOfBirth = await vault.dateOfBirth.retrieveDateOfBirth(response.id);
            expect(dateOfBirth).to.not.be.empty;
            expect(dateOfBirth.id).to.not.be.empty;
            expect(dateOfBirth.iv).to.not.be.empty;
            expect(dateOfBirth.authTag).to.not.be.empty;
            expect(dateOfBirth.dateofbirth).to.be.equal(dateOfBirthExample);
        });
    });

    describe('retrieveDateOfBirthFromRealData', () => {
        it('should get an existing dateofbirth', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                dateofbirthAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const dateofbirthExample = 'dateofbirth-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const dateofbirthHash = vault.hash(dateofbirthExample);

            nock(apiHost)
                .get(`/vault/static/dateofbirth?hash=${encodeURIComponent(dateofbirthHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedDateOfBirth = security.aesEncrypt(vaultMasterKey, iv, dateofbirthExample);
                    response.iv = encryptedDateOfBirth.initializationVector;
                    response.authTag = encryptedDateOfBirth.authenticationTag;
                    response.dateofbirth = encryptedDateOfBirth.encryptedData;
                    callback(null, [response]);
                });

            const dateofbirthList = await vault.dateOfBirth.retrieveDateOfBirthFromRealData(dateofbirthExample, ['1', '2']);

            dateofbirthList.forEach((dateofbirth) => {
                expect(dateofbirth).to.not.be.empty;
                expect(dateofbirth.id).to.not.be.empty;
                expect(dateofbirth.iv).to.not.be.empty;
                expect(dateofbirth.authTag).to.not.be.empty;
                expect(dateofbirth.dateofbirth).to.be.equal(dateofbirthExample);
            });
        });
    });

    describe('deleteDateOfBirth', () => {
        it('should delete this specific dateOfBirth', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const dateOfBirthId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/dateofbirth/${dateOfBirthId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.dateOfBirth.deleteDateOfBirth(dateOfBirthId);
        });
    });
});

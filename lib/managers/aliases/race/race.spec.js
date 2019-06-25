const nock = require('nock');
const StaticVault = require('../../static-vault/static-vault');
const Client = require('../../../client');
const Security = require('../../../services/security');
const { expect } = require('chai');

describe('Race Manager', () => {
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

    describe('createRace', () => {
        it('should create a new race and return the race', async () => {
            const security = new Security();
            const payload = {
                race: 'race-example',
                tags: ['tag', 'test'],
            };

            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                raceAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .post(`/vault/static/${vaultId}/race`, (body) => {
                    return body.race && body.iv && body.authTag && body.tags;
                })
                .reply(200, (uri, body, callback) => {
                    response.race = body.race;
                    response.iv = body.iv;
                    response.authTag = body.authTag;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, 'd490157b23534215b0369a2685aab47f', vaultMasterKey);
            const race = await vault.race.createRace(payload.race, payload.tags);
            expect(race).to.not.be.empty;
            expect(race.id).to.not.be.empty;
            expect(race.iv).to.not.be.empty;
            expect(race.authTag).to.not.be.empty;
            expect(race.race).to.be.equal(payload.race);
        });
    });

    describe('retrieveRace', () => {
        it('should get an existing race', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                raceAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const raceExample = 'race-example';

            nock(apiHost)
                .get(`/vault/static/${vaultId}/race/${response.id}`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedRace = security.aesEncrypt(vaultMasterKey, iv, raceExample);
                    response.iv = encryptedRace.initializationVector;
                    response.authTag = encryptedRace.authenticationTag;
                    response.race = encryptedRace.encryptedData;
                    callback(null, response);
                });

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const race = await vault.race.retrieveRace(response.id);
            expect(race).to.not.be.empty;
            expect(race.id).to.not.be.empty;
            expect(race.iv).to.not.be.empty;
            expect(race.authTag).to.not.be.empty;
            expect(race.race).to.be.equal(raceExample);
        });
    });

    describe('retrieveRaceFromRealData', () => {
        it('should get an existing race', async () => {
            const security = new Security();
            const response = {
                id: 'e490157b23534215b0369a2685aab47g',
                raceAlias: 'some-alias',
                tags: ['tag', 'test'],
                createdAt: '2018-07-14 T01:00:00Z',
            };

            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const vaultMasterKey = security.aesGenerateMasterKey();
            const raceExample = 'race-example';

            const client = new Client();
            client.hashKey = '123';

            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            const raceHash = vault.hash(raceExample);

            nock(apiHost)
                .get(`/vault/static/${vaultId}/race?hash=${encodeURIComponent(raceHash)}&tags=1&tags=2`)
                .reply(200, (uri, body, callback) => {
                    const iv = security.aesGenerateInitializationVector();
                    const encryptedRace = security.aesEncrypt(vaultMasterKey, iv, raceExample);
                    response.iv = encryptedRace.initializationVector;
                    response.authTag = encryptedRace.authenticationTag;
                    response.race = encryptedRace.encryptedData;
                    callback(null, [response]);
                });

            const raceList = await vault.race.retrieveRaceFromRealData(raceExample, ['1', '2']);
            raceList.forEach((race) => {
                expect(race).to.not.be.empty;
                expect(race.id).to.not.be.empty;
                expect(race.iv).to.not.be.empty;
                expect(race.authTag).to.not.be.empty;
                expect(race.race).to.be.equal(raceExample);
            });
        });
    });

    describe('deleteRace', () => {
        it('should delete this specific race', async () => {
            const security = new Security();
            const vaultId = 'd490157b23534215b0369a2685aab47f';
            const raceId = 'e490157b23534215b0369a2685aab47g';
            const vaultMasterKey = security.aesGenerateMasterKey();

            nock(apiHost)
                .delete(`/vault/static/${vaultId}/race/${raceId}`)
                .reply(200);

            const client = new Client();
            client.hashKey = '123';
            const vault = await StaticVault.retrieveStaticVault(client, vaultId, vaultMasterKey);
            await vault.race.deleteRace(raceId);
        });
    });
});

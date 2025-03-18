import request from "supertest";
import { app } from "../app";
import { createTestCharacterClass, clearTables } from '../helpers/database.helper';
import logger from "../config/logger.config";


// Dummy tokens for testing purposes. In a real test, either generate valid JWTs
// or stub/bypass the authentication middleware.
const gmToken = 'dummyGameMasterToken';
const userToken = 'dummyUserToken';

describe('Character Service Endpoints', () => {
    let testCharacterId: number;
    let testClassId: number;

    beforeEach(async () => {
        await clearTables();
        // Create a test character class
        const characterClass = await createTestCharacterClass();
        testClassId = characterClass.id;
    });

    // Test creating a new character
    it('POST /api/character - should create a new character', async () => {
        const newCharacter = {
            name: 'Test Character',
            health: 100,
            mana: 50,
            baseStrength: 10,
            baseAgility: 10,
            baseIntelligence: 10,
            baseFaith: 10,
            classId: testClassId // Assumes a valid character class with id 1 exists
        };
        logger.info('Creating new character:', newCharacter);
        const response = await request(app)
            .post('/api/character')
            .set('Authorization', `Bearer ${userToken}`)
            .send(newCharacter);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newCharacter.name);

        testCharacterId = response.body.id;
    });

    // Test listing all characters (accessible only to GameMasters)
    it('GET /api/character - should list all characters for GameMaster', async () => {
        const response = await request(app)
            .get('/api/character')
            .set('Authorization', `Bearer ${gmToken}`);

        expect(response.statusCode).toBe(200);

        // Check that returned characters have the expected properties
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('health');
            expect(response.body[0]).toHaveProperty('mana');
        }
    });

    // Test retrieving character details by ID (accessible to the owner or GameMaster)
    it('GET /api/character/:id - should retrieve character details', async () => {
            // First create a test character
            const newCharacter = {
                name: 'Test Character',
                health: 100,
                mana: 50,
                baseStrength: 10,
                baseAgility: 10,
                baseIntelligence: 10,
                baseFaith: 10,
                classId: testClassId
            };
    
            // Create the character
            const createResponse = await request(app)
                .post('/api/character')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newCharacter);
    
            expect(createResponse.statusCode).toBe(201);
            testCharacterId = createResponse.body.id;
            
        // Now test getting the character
        const response = await request(app)
            .get(`/api/character/${testCharacterId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', testCharacterId);
    });

}); 
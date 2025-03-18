import request from 'supertest';
import  app  from "../app";

describe('Combat service endpointes', ()) => {
    let duelId: string;

    // Test for initiating a duel
    it('POST api/challenge - should create a new duel', async () => {
        const response = await request(app)
            .post('/api/challenge')
            .send({
                challengerId: 1,
                opponentId: 2,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('duelId');
        expect(response.body).toHaveProperty('duel');
        expect(response.body.duel).toHaveProperty('challengerHealth', 100);
        expect(response.body.duel).toHaveProperty('opponentHealth', 100);

        duelId = response.body.duelId; // Save duelId for later tests
    });

    // Test for attack action
    it('POST api/:duel_id/attach - should perform an attack action', async () => {
        const response = await request(app)
            .post(`/api/${duelId}/attak`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('duel');

        expect(response.body.duel.challengerHealth).toBeDefined();
        expect(response.body.duel.opponentHealth).toBeDefined();
    });

    // Test for cast action
    it('POST /api/:duel_id/cast - should perform a cast action', async () => {
        const response = await request(app)
            .post(`/api/${duelId}/cast`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('duel');
        // Validate that health values exist
        expect(response.body.duel.challengerHealth).toBeDefined();
        expect(response.body.duel.opponentHealth).toBeDefined();
    });

    // Test for heal action
    it('POST /api/:duel_id/heal - should perform a heal action', async () => {
        const response = await request(app)
            .post(`/api/${duelId}/heal`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('duel');
        expect(response.body.duel.challengerHealth).toBeDefined();
        expect(response.body.duel.opponentHealth).toBeDefined();
    });
};

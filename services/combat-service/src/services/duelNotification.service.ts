import axios from 'axios';

interface DuelOutcomePayload {
    winnerId: number;
    loserId: number;
    awardedItemId: number;
}

export const notifyDuelOutcome = async (payload: DuelOutcomePayload) => {
    try {
        const characterServiceUrl = process.env.CHARACTER_SERVICE_URL || 'http://localhost:3000';
        const response = await axios.post(`${characterServiceUrl}/api/duel-outcome`, payload);
        console.log('Duel outcome notification sent successfully:', response.data);
    } catch (error) {
        console.error('Error notifying duel outcome:', error);
    }
};
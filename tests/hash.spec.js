import { hashToState } from "../src/hash";

describe('hash', () => {
    it('parses a valid hash correctly to a valid state', () => {
        const testHash = '#1,2,3,4,5,Jane%20Doe,Engineering%20Manager';

        const actualState = hashToState(testHash);

        expect(actualState).toEqual({
            name: 'Jane Doe',
            title: 'Engineering Manager',
            milestoneByTrack: {
                'TECHNOLOGY': 1,
                'SYSTEM': 2,
                'PEOPLE': 3,
                'PROCESS': 4,
                'INFLUENCE': 5,
            },
            focusedTrackId: 'TECHNOLOGY'
        });
    });
});


export const emptyState = (): SnowflakeAppState => {
    return {
        name: '',
        title: '',
        milestoneByTrack: {
            'TECHNOLOGY': 0,
            'SYSTEM': 0,
            'PEOPLE': 0,
            'PROCESS': 0,
            'INFLUENCE': 0
        },
        focusedTrackId: 'TECHNOLOGY'
    }
};

export const defaultState = (): SnowflakeAppState => {
    return {
        name: '',
        title: 'Software Engineer - IC1',
        milestoneByTrack: {
            'TECHNOLOGY': 0,
            'SYSTEM': 0,
            'PEOPLE': 0,
            'PROCESS': 0,
            'INFLUENCE': 0
        },
        focusedTrackId: 'TECHNOLOGY'
    }
};

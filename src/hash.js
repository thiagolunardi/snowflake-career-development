// @flow

import type {Milestone} from "../constants";
import {trackIds} from "../constants";
import { defaultState } from "./state";

const coerceMilestone = (value: number): Milestone => {
    // HACK I know this is goofy but i'm dealing with flow typing
    switch (value) {
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 3;
        case 4:
            return 4;
        case 5:
            return 5;
        default:
            return 0;
    }
};

export const stateToHash = (state: SnowflakeAppState) => {
    if (!state || !state.milestoneByTrack) return null;
    const values = trackIds.map(trackId => state.milestoneByTrack[trackId]).concat(encodeURI(state.name), encodeURI(state.title));
    return values.join(',');
};

export const hashToState = (hash: String): ?SnowflakeAppState => {
    if (!hash) return null;
    const result = defaultState();
    const hashValues = hash.split('#')[1].split(',');
    if (!hashValues) return null;
    trackIds.forEach((trackId, i) => {
        result.milestoneByTrack[trackId] = coerceMilestone(Number(hashValues[i]));
    });
    if (hashValues[trackIds.length]) result.name = decodeURI(hashValues[trackIds.length]);
    if (hashValues[trackIds.length + 1]) result.title = decodeURI(hashValues[trackIds.length + 1]);
    return result
};

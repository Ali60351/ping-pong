import { createSlice } from '@reduxjs/toolkit';

export interface GameState {
    playerOne: number,
    playerTwo: number,
    ball: [number, number]
}

const initialState: GameState = {
    playerOne: 0,
    playerTwo: 0,
    ball: [0, 0]
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateGameState(state, action: { payload: GameState }) {
            state.playerOne = action.payload.playerOne;
            state.playerTwo = action.payload.playerTwo;
            state.ball = action.payload.ball;
        },
    },
})

// Extract the action creators object and the reducer
const { actions, reducer } = gameSlice

// Extract and export each action creator by name
export const { updateGameState } = actions

// Export the reducer, either as a default or named export
export default reducer

import { createSlice } from '@reduxjs/toolkit';

export interface FrameState {
    playerOne: number,
    playerTwo: number,
    ball: [number, number],
    score: number,
}

export interface GameState extends FrameState {
    status: string
}

const initialState: GameState = {
    playerOne: 0,
    playerTwo: 0,
    ball: [10, 0],
    score: 0,
    status: 'Waiting for players'
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateGameState(state, action: { payload: FrameState }) {
            state.status = '';
            state.playerOne = action.payload.playerOne;
            state.playerTwo = action.payload.playerTwo;
            state.ball = action.payload.ball;
            state.score = action.payload.score;
        },
        updateStatus(state, action: { payload: string }) {
            state.status = action.payload
        }
    },
})

const { actions, reducer } = gameSlice
export const { updateGameState, updateStatus } = actions
export default reducer

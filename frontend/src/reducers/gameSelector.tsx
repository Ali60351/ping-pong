import { createSelector } from '@reduxjs/toolkit';
import { GameState } from './gameReducer';

const gameSelector = createSelector(
    (state: GameState) => state,
    (state) => ({
        playerOneY: state.playerOne,
        playerTwoY: state.playerTwo,
        ballPosition: state.ball,
        score: state.score,
        status: state.status
    })
  )


export default gameSelector;

import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber'
import { useSelector, useDispatch } from 'react-redux';

import Paddle from './Paddle';
import Ball from './Ball';
import gameSelector from '../reducers/gameSelector';
import { updateGameState } from '../reducers/gameReducer';

const Game = () => {
    const dispatch = useDispatch();
    const gameState = useSelector(gameSelector);

    const { playerOneY, playerTwoY, ballPosition } = gameState;

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/game');

        socket.addEventListener('open', function (event) {
            // socket.send('50');
        });

        socket.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);

            const {
                playerOne = playerOneY,
                playerTwo = playerTwoY,
                ball = ballPosition
            } = data;

            dispatch(updateGameState({ playerOne, playerTwo, ball }));
        });
    }, [dispatch, playerOneY, playerTwoY, ballPosition]);

    return <Canvas camera={{ fov: 90, near: 0.1, far: 1000, position: [0, 0, 300] }}>
        <ambientLight />
        <Paddle position={[-340, playerOneY, 0]} />
        <Paddle position={[340, playerTwoY, 0]} />
        <Ball position={[...ballPosition, 0]} />
    </Canvas>;
};

export default Game;

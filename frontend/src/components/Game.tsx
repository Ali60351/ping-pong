import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber'
import { useSelector, useDispatch } from 'react-redux';

import Paddle from './Paddle';
import Ball from './Ball';
import InputHandler from './InputHandler';

import gameSelector from '../reducers/gameSelector';
import { updateGameState } from '../reducers/gameReducer';
import { VALID_KEYS } from '../constants';
import styles from './Game.module.css';

const Game = () => {
    const dispatch = useDispatch();
    const gameState = useSelector(gameSelector);

    const socket = useMemo(() => {
        const ws = new WebSocket('ws://localhost:8000/game');

        ws.addEventListener('open', () => {
            // document.addEventListener("keypress", e => {
            //     console.log(e);
            // });
        });

        ws.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);
            const { playerOne, playerTwo, ball } = data;
            dispatch(updateGameState({ playerOne, playerTwo, ball }));
        });

        return ws;
    }, [dispatch]);

    const { playerOneY, playerTwoY, ballPosition } = gameState;

    useEffect(() => {
        const keyPressHandler = (e: KeyboardEvent) => {
            if (!VALID_KEYS.includes(e.key)) {
                return;
            }

            console.log(e);
        };

        document.addEventListener("keydown", keyPressHandler);

        return () => {
            document.removeEventListener("keydown", keyPressHandler);
        }
    }, []);

    return <div className={styles.container}>
        <div className={styles.status}>
            <span>Player 1</span>
        </div>
        <div className={styles.canvasContainer}>
            <Canvas camera={{ fov: 90, near: 0.1, far: 1000, position: [0, 0, 300] }}>
            { socket.readyState === 1 && <InputHandler socket={socket} /> }
            <ambientLight />
            <Paddle position={[-340, playerOneY, 0]} />
            <Paddle position={[340, playerTwoY, 0]} />
            <Ball position={[...ballPosition, 0]} />
        </Canvas>
        </div>
    </div>;
};

export default Game;

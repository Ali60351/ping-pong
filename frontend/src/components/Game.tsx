import { useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber'
import { useSelector, useDispatch } from 'react-redux';

import Paddle from './Paddle';
import Ball from './Ball';
import InputHandler from './InputHandler';

import gameSelector from '../reducers/gameSelector';
import { updateGameState, updateStatus } from '../reducers/gameReducer';
import styles from './Game.module.css';
import { READY_MESSAGE } from '../constants';

const Game = () => {
    const dispatch = useDispatch();
    const gameState = useSelector(gameSelector);

    const [player, setPlayer] = useState<null | 'ONE' | 'TWO'>(null);
    const [ready, setReady] = useState(false);

    const closeHandler = useCallback(() => {
        dispatch(updateStatus('Unexpected error. Please restart game!'));
    }, [dispatch]);

    const socket = useMemo(() => {
        let ws = new WebSocket('ws://localhost:8000/game');

        ws.addEventListener('error', event => {
            if (ws.readyState === 3) {
                dispatch(updateStatus('Unable to connect!'));
            }
        })

        ws.addEventListener('open', () => {
            ws.addEventListener('close', closeHandler)
        })

        ws.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);

            if (data.type === 'INIT') {
                if (data.playerCount === 1) {
                    setPlayer('ONE');
                } else if (data.playerCount === 2) {
                    setPlayer('TWO');
                } else {
                    alert('Server is busy!');
                }
            } else if (data.type === 'READY') {
                setReady(true);
                dispatch(updateStatus(READY_MESSAGE));
            } else if (data.type === 'FRAME') {
                const { playerOne, playerTwo, ball, score } = data;
                dispatch(updateGameState({ playerOne, playerTwo, ball, score }));
            } else if (data.type === 'STATUS') {
                dispatch(updateStatus(data.message));
            }
        });

        return ws;
    }, [dispatch, closeHandler]);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.removeEventListener('close', closeHandler);
                socket.close()
            }
        }
    }, [socket, closeHandler]);

    const { playerOneY, playerTwoY, ballPosition, score, status } = gameState;

    return <div className={styles.container}>
        <div className={styles.status}>
            {status && <div>{status}</div>}
            {player === 'ONE' && <span>{`PLAYER ONE: ${score}`}</span>}
            {player === 'TWO' && <span>{`PLAYER TWO: ${score}`}</span>}
        </div>
        <div className={styles.canvasContainer}>
            <Canvas camera={{ fov: 90, near: 0.1, far: 1000, position: [0, 0, 300] }}>
            {
                ready && player && socket.readyState === 1 && <InputHandler
                    socket={socket}
                    player={player}
                />
            }
            <ambientLight />
            <Paddle position={[340, playerTwoY, 0]} isPlayer={player === 'TWO'} />
            <Paddle position={[-340, playerOneY, 0]} isPlayer={player === 'ONE'} />
            <Ball position={[...ballPosition, 0]} />
        </Canvas>
        </div>
    </div>;
};

export default Game;

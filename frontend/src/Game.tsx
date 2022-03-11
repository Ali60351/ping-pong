import React from 'react';
import { Canvas } from '@react-three/fiber'

import Paddle from './Paddle';
import Ball from './Ball';

const Game = () => {
    return <Canvas camera={{ fov: 90, near: 0.1, far: 1000, position: [0, 0, 300] }}>
        <ambientLight />
        <Paddle position={[-300, 0, 0]} />
        <Paddle position={[300, 0, 0]} />
        <Ball position={[0, 0, 0]} />
    </Canvas>;
};

export default Game;

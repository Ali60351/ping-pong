import React, { useRef } from 'react';

type PaddleProps = JSX.IntrinsicElements['mesh'] & { isPlayer: boolean }

const Paddle = (props: PaddleProps) => {
    const ref = useRef<THREE.Mesh>(null!)
    const { isPlayer, ...rest } = props;

    return (
      <mesh
        {...rest}
        ref={ref}
      >
        <boxGeometry args={[20, 100, 0]} />
        <meshStandardMaterial color={isPlayer ? 'yellow' : 'white'} />
      </mesh>
    )
};

export default Paddle;

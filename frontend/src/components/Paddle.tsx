import React, { useRef, useState } from 'react';

const Paddle = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    // useFrame((state, delta) => {
    //   ref.current.rotation.x += 0.01
    //   ref.current.rotation.y += 0.01
    // })

    return (
      <mesh
        {...props}
        ref={ref}
        // scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[20, 100, 0]} />
        <meshStandardMaterial color={hovered ? 'aqua' : 'white'} />
      </mesh>
    )
};

export default Paddle;
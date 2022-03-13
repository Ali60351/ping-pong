import { useRef } from 'react';

const Ball = (props: JSX.IntrinsicElements['mesh']) => {
    const ref = useRef<THREE.Mesh>(null!)

    return (
      <mesh
        {...props}
        ref={ref}
      >
        <circleGeometry args={[10]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    )
};

export default Ball;

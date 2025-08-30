import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";

export default function ThreeScene() {
  return (
    <Canvas className="w-full h-64 rounded-xl">
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Float speed={1} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="pink" />
          <Html center>
            <div className="text-white font-bold text-center">3D Object</div>
          </Html>
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

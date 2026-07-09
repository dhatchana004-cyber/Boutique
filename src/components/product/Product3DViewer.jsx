import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function ProductImageCard({ imageUrl }) {
  const meshRef = useRef()
  // Load the texture
  const texture = useTexture(imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        {/* A thin box to give the 2D image some 3D depth */}
        <boxGeometry args={[3, 4, 0.05]} />
        <meshPhysicalMaterial 
          map={texture}
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.3}
          envMapIntensity={1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>
    </Float>
  )
}

// Fallback if no image is provided
function PlaceholderModel() {
  const meshRef = useRef()
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.1} envMapIntensity={2} />
      </mesh>
    </Float>
  )
}

export default function Product3DViewer({ image }) {
  return (
    <div className="w-full h-full bg-[#111111] rounded-2xl overflow-hidden relative cursor-grab active:cursor-grabbing">
      <div className="absolute top-4 right-4 z-10 bg-black/50 px-3 py-1 rounded-full text-white text-[10px] font-sans tracking-widest uppercase border border-white/10 pointer-events-none backdrop-blur-md">
        3D View - Drag to Rotate
      </div>
      <Canvas shadows camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <color attach="background" args={['#111111']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          {image ? <ProductImageCard imageUrl={image} /> : <PlaceholderModel />}
          <Environment preset="city" />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { createRoot } from 'react-dom/client'

function Block(props) {
  const mref = useRef()
  const [active, setActive] = 
  useState(false)
  const [hovered, setHover] = 
  useState(false)
  useFrame((state, delta) => 
    (mref.current.rotation.z += delta))
  return (
  <mesh 
    {...props}
    ref = {mref}
    scale = {active ? 1.5 : 1}
    onClick = {(event) => 
      setActive(!active)}
    onPointerOver = {(event) => 
      setHover(true)}
    onPointerOut = {(event) => 
      setHover(false)}>
    <boxGeometry args={[2,2,2]}/>
    <meshStandardMaterial color = 
    {hovered ? 'orange' : 'green'}/>
    </mesh>
  )
}

createRoot(document.getElementById('root')).render(
  <Canvas>
    <ambientLight intensity={1/2}/>
    <spotLight position={[10, 10, 10]} 
    angle={0.15} penumbra={1} decay={0} 
    intensity={Math.PI} />

    <pointLight position={[-10, -10, -10]} 
    decay={0} intensity={Math.PI} />

    <Block position={[-1.2, 0, 0]} />
    <Block position={[1.2, 0, 0]} />
  </Canvas>
)
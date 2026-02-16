import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { createRoot } from 'react-dom/client'
import { MapControls, OrthographicCamera } from "@react-three/drei"
import { simpleMap, testMap, emptyMap } from './maps'

const s = 0.95

function Obstacle(props) {
  const oRef = useRef()
  const [active, setActive] = 
  useState(false)
  return (
  <mesh 
    {...props}
    ref = {oRef}
    onClick = {(event) => 
      setActive(!active)}>
    <boxGeometry 
    args={[s,s,s]}/>
    <meshStandardMaterial 
    color={active ? 'hotpink' : 'orange'}
    wireframe={false}/>
    </mesh>
  )
}

function Player(props) {
  const pRef = useRef()
  const [selected, setSelected] = useState(false)
  return (
    <mesh
    {...props}
    ref={pRef}
    onClick = {(event) =>
      setSelected(!selected)}>
    <boxGeometry args={[s,s,s]}/>
    <meshStandardMaterial
    color={selected ? 'blue' : 'green'}/>
    </mesh>
  )
}

function Floor() {
  return (
  <mesh
    position={[-0.5, 0,-0.5]}
    rotation={[-Math.PI/2, 0,0]}
    receiveShadow>
    <planeGeometry args={[10,10]}/>
    <meshStandardMaterial/>
  </mesh>
  )
}

function Scene(props) {
  const map = testMap
  const [entities, setEntities] = useState(() =>
  parseMap(map))
  return (
  <>
    <ambientLight intensity={Math.PI/4}/>
    <pointLight position={[7,6,7]} 
    decay={0} intensity={2.5} />
    <OrthographicCamera makeDefault
    position={[5,5,5]}
    zoom={25}
    near={-50}
    far={100} />
    <MapControls makeDefault
    target={[0,0,0]}/>
    {obstacles}
    {players}
    <Floor/>
  </>
  )
}

createRoot(document.getElementById('root')).render(
  <div style={{
    width: '390px',
    height: '820px',
    background: 'black'
  }}>
    <Canvas>
      <Scene/>
    </Canvas>
  </div>
)
import { useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { createRoot } from 'react-dom/client'
import { MapControls, OrthographicCamera } from "@react-three/drei"
import { simpleMap, testMap, emptyMap, parseMap } from './maps'
import { useGame } from './gameState'

const s = 0.95

function Obstacle({position, ...props}) {
  const [active, setActive] = 
  useState(false)
  return (
  <mesh 
    {...props}
    position = {position}
    onClick = {(event) => {
      event.stopPropagation()
      setActive(!active)}}>
    <boxGeometry 
    args={[s,s,s]}/>
    <meshStandardMaterial 
    color={active ? 'hotpink' : 'orange'}
    wireframe={false}/>
    </mesh>
  )
}

function Player({position, ...props}) {
  const pRef = useRef()
  const [selected, setSelected] = 
  useState(false)
  return (
    <mesh
    {...props}
    position={position}
    ref={pRef}
    onClick = {(event) => {
      event.stopPropagation()
      setSelected(!selected)}}>
    <boxGeometry args={[s,s,s]}/>
    <meshStandardMaterial
    color={selected ? 'white' : 'blue'}/>
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
    <meshStandardMaterial
    color='green'/>
  </mesh>
  )
}

function Scene(props) {
  const map = simpleMap
  const { staticTiles, Entities,
    mapInfo} = useMemo(() => 
      parseMap(map), [map])

  const init = useGame(state => 
    state.init)
  const players = useGame(state =>
    state.players)
  const enemies = useGame(state =>
    state.enemies)

  useEffect(() => {
    init(Entities, staticTiles,
      mapInfo)}, [Entities, mapInfo,
        staticTiles])
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
    {staticTiles.map((tile) => 
      <Obstacle key={tile.id}
      position={[tile.position.x - 5,
        tile.position.y + 0.5,
        tile.position.z - 5]} />
      )}
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
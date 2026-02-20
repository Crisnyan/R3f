import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { createRoot } from "react-dom/client";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import { simpleMap, testMap, emptyMap, parseMap } from "./maps";
import { useGame } from "./gameState";

const s = 0.975;

function Obstacle({ position, highlighted, ...props }) {
  const [active, setActive] = useState(false);
  return (
    <mesh
      {...props}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        setActive(!active);
      }}>
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial
        color={highlighted ? "hotpink" : "orange"}
        wireframe={false}
      />
    </mesh>
  );
}

function Enemy({ id, position, ...props }) {
  const eRef = useRef();
  const [selected, setSelected] = useState(false);
  return (
    <mesh
      {...props}
      position={position}
      ref={eRef}
      onClick={(event) => {
        event.stopPropagation();
        setSelected(!selected);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={selected ? "black" : "red"} />
    </mesh>
  );
}

function Player({ id, position, ...props }) {
  const pRef = useRef();
  const [selected, setSelected] = 
  useState(false)
  const selectEntity = 
  useGame(state =>
    state.selectEntity);
  return (
    <mesh
      {...props}
      position={position}
      ref={pRef}
      onClick={(event) => {
        event.stopPropagation();
        setSelected(!selected)
        selectEntity(id);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={selected ? "white" : "blue"} />
    </mesh>
  );
}

function Floor({ position, highlighted, ...props }) {
  return (
    <mesh 
    {...props}
    position={position} 
    receiveShadow
    onClick={(event) => 
    {event.stopPropagation()}
    }>
      <boxGeometry args={[s, 0.5 * s, s]} />
      <meshStandardMaterial color={highlighted ? 
      'hotpink' : 'green'} />
    </mesh>
  );
}

function GridFloor(props) {
  const tiles = [];
  const highlights = useGame(state =>
    state.highlights);

  for (let z = 0; z < 10; ++z) {
    for (let x = 0; x < 10; ++x) {
      const key = `${x}-${-1}-${z}`
      tiles.push(
        <Floor
          key={key}
          position={[x - 5, -0.25, z - 5]}
          highlighted={highlights[key]}
        />
      );
    }
  }
  return (
  <group>
    {tiles}
    </group>
    )
}

function Scene(props) {
  const map = simpleMap;
  const { staticTiles, entities, mapInfo } = useMemo(
    () => parseMap(map),
    [map],
  );

  const init = 
  useGame((state) =>
    state.init);
  const players = 
  useGame((state) => 
    state.players);
  const enemies = 
  useGame((state) => 
    state.enemies);

  useEffect(() => {
    init(entities, staticTiles, mapInfo);
  }, [entities, mapInfo, staticTiles]);
  const highlights = 
  useGame(state =>
    state.highlights)
  return (
    <>
      <ambientLight intensity={Math.PI / 4} />
      <pointLight position={[7, 6, 7]} decay={0} intensity={2.5} />
      <OrthographicCamera
        makeDefault
        position={[5, 5, 5]}
        zoom={25}
        near={-50}
        far={100}
      />
      <MapControls
        makeDefault
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
      {staticTiles.map((tile) => (
        <Obstacle
          key={tile.id}
          position={[
            tile.position.x - 5,
            tile.position.y + 0.5,
            tile.position.z - 5,
          ]}
          highlighted={highlights[tile.id]}
        />
      ))}
      {Object.values(players).map((p) => (
        <Player
          key={p.id}
          id={p.id}
          position={[p.position.x - 5, p.position.y + 0.5, p.position.z - 5]}
        />
      ))}
      {Object.values(enemies).map((e) => (
        <Enemy
          key={e.id}
          id={e.id}
          position={[e.position.x - 5, e.position.y + 0.5, e.position.z - 5]}
        />
      ))}
      <GridFloor />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <div
    style={{
      width: "390px",
      height: "820px",
      background: "black",
    }}
  >
    <Canvas>
      <Scene />
    </Canvas>
  </div>,
);

import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { createRoot } from "react-dom/client";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import { simpleMap, testMap, emptyMap, parseMap } from "./maps";
import { useGame } from "./gameState";

const s = 0.975;

function Obstacle({ position, ...props }) {
  const [active, setActive] = useState(false);
  return (
    <mesh
      {...props}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        setActive(!active);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial
        color={active ? "hotpink" : "orange"}
        wireframe={false}
      />
    </mesh>
  );
}

function Enemy({ position, ...props }) {
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

function Player({ position, ...props }) {
  const pRef = useRef();
  const [selected, setSelected] = useState(false);
  return (
    <mesh
      {...props}
      position={position}
      ref={pRef}
      onClick={(event) => {
        event.stopPropagation();
        setSelected(!selected);
      }}
    >
      <boxGeometry args={[s, s, s]} />
      <meshStandardMaterial color={selected ? "white" : "blue"} />
    </mesh>
  );
}

function Floor({ position, ...props }) {
  const [isHl, setHl] = useState(false)
  return (
    <mesh 
    {...props}
    position={position} receiveShadow
    on
    onClick={(event) => 
    {event.stopPropagation()
      setHl(!isHl)
    }
    }>
      <boxGeometry args={[s, 0.5 * s, s]} />
      <meshStandardMaterial color={isHl ? 
      'hotpink' : 'green'} />
    </mesh>
  );
}

function GridFloor(props) {
  const tiles = [];

  for (let z = 0; z < 10; ++z) {
    for (let x = 0; x < 10; ++x) {
      tiles.push(
        <Floor
          key={`${x}-${z}`}
          position={[x - 5, -0.25, z - 5]}
        />,
      );
    }
  }
  return <group>{tiles}</group>;
}

function Scene(props) {
  const map = simpleMap;
  const { staticTiles, entities, mapInfo } = useMemo(
    () => parseMap(map),
    [map],
  );

  const init = useGame((state) => state.init);
  const players = useGame((state) => state.players);
  const enemies = useGame((state) => state.enemies);

  useEffect(() => {
    init(entities, staticTiles, mapInfo);
  }, [entities, mapInfo, staticTiles]);
  return (
    <>
      <ambientLight intensity={Math.PI / 4} />
      <pointLight position={[7, 6, 7]} decay={0} intensity={2.5} />
      <OrthographicCamera
        makeDefault
        position={[5, 5, 5]}
        zoom={25}
        near={1}
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
        />
      ))}
      {Object.values(players).map((p) => (
        <Player
          key={p.id}
          position={[p.position.x - 5, p.position.y + 0.5, p.position.z - 5]}
        />
      ))}
      {Object.values(enemies).map((e) => (
        <Enemy
          key={e.id}
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

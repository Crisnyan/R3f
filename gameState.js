import { create } from "zustand";

export const useGame = create((set, get) => ({
  turn: 1,
  executeTurn: false,
  selectedEnt: null,
  players: {},
  enemies: {},
  obstacles: {},
  highlights: {},

  nextTurn: () => set((state) => ({ turn: state.turn + 1 })),

  selectEntity: (Id) =>
    set((state) => {
      if (Id === state.selectedEnt) {
        return {
          selectedEnt: null,
          highlights: {},
        };
      }

      let ent = state.players[Id];
      if (!ent)
        ent = state.enemies[Id];
      const hlId = state.dijkstra(
        ent.position, ent.dice[ent.dice.length - 1]);
      const hlTiles = {};
      hlId.forEach((id) => (hlTiles[id] = true));
      return {
        selectedEnt: ent.id,
        highlights: hlTiles,
      };
    }),
  moveTo: (tileId) => set((state) => {
    const [x, y, z] = tileId.split(
      '-').map(Number)
    const dest = {x, y: (y + 1), z}
    let ent = 
    state.players[state.selectedEnt]
    if (!ent)
      ent = state.enemies[state.selectedEnt]
    const path = state.Astar(
      ent.position, dest)
  }
),
  changeMode: () => set((state) => ({ executeTurn: !state.executeTurn })),

  init: (Entities, staticTiles, mapInfo) => {
    const playEnt = {};
    const enemEnt = {};
    const worldMap = {};
    const mapBounds = {};

    for (let z = 0; z < mapInfo.depth; ++z) {
      for (let x = 0; x < mapInfo.width; ++x) {
        const key = `${x}-${-1}-${z}`;
        worldMap[key] = true;
      }
    }
    staticTiles.forEach((obstacle) => {
      worldMap[obstacle.id] = true;
    });
    Entities.forEach((entity) => {
      state.entities[entity.id] = {
        ...entity
      }
      if (entity.type == "player") {
        playEnt[entity.id] = {
          ...entity,
          maxHp: 10,
          hp: 10,
          dice: [6, 6, 6, 6],
        };
      }
      if (entity.type == "enemy") {
        enemEnt[entity.id] = {
          ...entity,
          maxHp: 5,
          hp: 5,
          dice: [4, 4],
        };
      }
    });
    set({
      players: playEnt,
      enemies: enemEnt,
      obstacles: worldMap,
      mapBounds: mapInfo,
    });
  },

  getEntity: (x, y, z) => {
    const state = get();
    const entities = [
      ...Object.values(state.players),
      ...Object.values(state.enemies),
    ];

    return entities.find(
      (e) => e.position.x === x && e.position.y === y && e.position.z === z,
    );
  },

  isBlocked: (x, y, z) => {
    const state = get();
    const key = `${x}-${y}-${z}`;

    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x >= state.mapBounds.width ||
      y >= state.mapBounds.height + 1  ||
      z >= state.mapBounds.depth ||
      state.obstacles[key] ||
      state.getEntity(x, y, z)
    )
      return true;
    return false;
  },

  hasFloor: (x, y, z) => {
    const state = get();
    if (
      y - 1 < 0 ||
      (state.isBlocked(x, y - 1, z) && !state.getEntity(x, y - 1, z))
    )
      return true;
    return false;
  },

  dijkstra: (pos, maxCost) => {
    const state = get();
    const max = state.mapBounds;
    const initial = `${pos.x}-${pos.y}-${pos.z}`;
    const nodes = [];
    const dist = {};
    const MOV = [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1],
      [1, 1, 0], [-1, 1, 0],
      [0, 1, 1], [0, 1, -1],
      [1, -1, 0], [-1, -1, 0],
      [0, -1, 1], [0, -1, -1]
    ];
    nodes.push(`${pos.x}-${pos.y}-${pos.z}`)
    for (let z = 0; z < max.depth; ++z) {
      for (let y = 0; y < max.height + 1; ++y) {
        for (let x = 0; x < max.width; ++x) {
          if (state.isBlocked(x, y, z) || !state.hasFloor(x, y, z)) continue;
          const key = `${x}-${y}-${z}`;
          dist[key] = Infinity;
          nodes.push(key);
        }
      }
    }
    dist[initial] = 0;
    const visited = new Set();
    while (visited.size < nodes.length) {
      let bestDist = Infinity;
      let bestKey = null;
      for (const key of nodes) {
        if (visited.has(key)) continue;
        if (dist[key] < bestDist) {
          bestDist = dist[key];
          bestKey = key;
        }
      }
      if (bestDist > maxCost || bestKey === null) break;
      visited.add(bestKey);
      const [x, y, z] = bestKey.split("-").map(Number);
      for (const [dx, dy, dz] of MOV) {
        const nx = x + dx;
        const ny = y + dy;
        const nz = z + dz;

        if (state.isBlocked(nx, ny, nz) || !state.hasFloor(nx, ny, nz))
          continue;
        const nkey = `${nx}-${ny}-${nz}`;
        if (!(nkey in dist)) continue;

        let stepCost = 1;
        if (dy === 1) stepCost += 1;
        const newCost = dist[bestKey] + stepCost;
        if (newCost < dist[nkey]) dist[nkey] = newCost;
      }
    }
    const reachable = [];
    for (const key in dist) {
      if (dist[key] <= maxCost) {
        const [x, y, z] = 
        key.split("-").map(Number);   
        reachable.push(`${x}-${y - 1}-${z}`);
      }
    }
    return reachable;
  },
  Astar: (src, dest) => {
  },
}));
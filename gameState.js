import { create } from 'zustand'
export const useGame = create((set, get) => ({
turn: 1,
executeTurn: false,
players: {},
enemies: {},
obstacles: {},

nextTurn: () => set((state) => (
  { turn: state.turn + 1 })
),

changeMode: () => set((state) => (
  { executeTurn: !state.executeTurn })
),
    
init: (Entities, staticTiles, mapInfo) => {
  const playEnt = {}
  const enemEnt = {}
  const obsMap = {}
  const mapBounds = {}

  staticTiles.forEach((obstacle) => {
    obsMap[obstacle.id] = true
  })
  Entities.forEach((entity) => {
    if (entity.type == 'player') {
      playEnt[entity.id] = {
        ...entity, 
        maxHp: 10,
        hp: 10
      }
    }
    if (entity.type == 'enemy') {
      enemEnt[entity.id] = {
        ...entity,
        maxHp: 5,
        hp: 5
      }
    }
  })
  set({ players: playEnt,
        enemies: enemEnt,
        obstacles: obsMap,
        mapBounds: mapInfo})
},

isBlocked: (x, y, z) => {
  const state = get()
  const key = `${x}-${y}-${z}`
  
  if (x < 0 || y < 0 || z < 0 
  || x >= state.mapBounds.width 
  || y >= state.mapBounds.height
  || z >= state.mapBounds.depth
  || state.obstacles[key])
    return true

  const entities = 
  [...Object.values(state.players), 
    ...Object.values(state.enemies)]

  return entities.some(u => 
      u.position.x === x 
      && u.position.y === y 
      && u.position.z === z)
  }
}))
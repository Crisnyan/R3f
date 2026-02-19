export const testMap = `
wwwwwwwwww
wwowwwwoww
wooowwooow
ooooooooow
oooooooooo
oooooooooo
ooooooooow
woooooooow
wwooooooww
wwwoooowww,

wwwwwwwwww
owoowwoowo
oooooooooo
oooooooooo
oooooooooo
oooooooooo
oooooooooo
oooooooooo
owoooooowo
wwooooooww,

wwwwwwwwww
wwooooooww
woooooooow
woooooooow
woooooooow
wwwwwwwwww
owwoooowwo
owwoooowwo                           
owwwwwwwwo
oooooooooo
`

export const simpleMap = `
wwwooeooww
oooooooooo
oooooooooo
oooowwooow
owowwwwooo
ooowwwwoow
oooowwoooo
woooooooow
owoooooooo
oooopooooo
`

export const emptyMap = ``

export const parseMap = (map) => {
  const entities = []
  const staticTiles = []
  let mapWidth = 0 //x
  let mapHeight = 0 //y
  let mapDepth = 0 //z
  const levels = map.trim().split(',')
  mapHeight = levels.length
  levels.forEach((level, y) => {
    const rows = level.trim().split('\n')
    mapDepth = rows.length
    rows.forEach((row, z) => {
      const chars = row.trim().split('')
      mapWidth = chars.length
      chars.forEach((char, x) => {
        const id = `${x}-${y}-${z}`
        const position = {x, y, z}
        switch (char) {
          case 'w':
            staticTiles.push({
              id,
              type: 'wall',
              position
            })
            break
          case 'p':
            entities.push({
              id,
              type: 'player',
              position
            })
            break
         case 'e':
            entities.push({
              id,
              type: 'enemy',
              position
            })
            break
          }
        })
      })
    })  
  return {
    staticTiles,
    entities,
    mapInfo : {
      width: mapWidth,
      height: mapHeight,
      depth: mapDepth
    }
  }       
}
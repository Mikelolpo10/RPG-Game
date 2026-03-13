function calculateDamage(attacker, target) {
  const rawDamage = attacker.damage
  const totalDamage = Math.round(rawDamage / (1 + (target.defense / 100)))
  return totalDamage
}

export function playerAttack(state, action) {
  const attacker = state.characters[action.payload.attacker]
  const target = state[action.payload.target]
  const targetHealth = Math.round(target.health - calculateDamage(attacker, target))
  const newState = {...state, enemy: {...state.enemy, health: targetHealth}}
  return newState
}

export function playerBlock(state, action) {
  const blockerKey = action.payload.blocker;
  const blocker = state.characters[blockerKey] 
  const newHealth = Math.round(blocker.health + (blocker.defense / 2))
  const newState = {...state, characters: {...state.characters, [blockerKey]: {...blocker, health: newHealth}}}
  return newState
}

export function playerBlock(state, action) {
  
}




// const initialState = {
//   characters: {
//     knight: { name: 'knight', health: 105, damage: 15, defense: 43, critChance: 0 },
//     wizard: { name: 'wizard', health: 65, damage: 38, defense: 18, critChance: 0 },
//     archer: { name: 'archer', health: 88, damage: 26, defense: 22, critChance: 0 },
//     priest: { name: 'priest', health: 82, damage: 8, defense: 30, critChance: 0 },
//   },
//   enemy: {
//     name: 'enemy',
//     health: 300,
//     damage: 30,
//     defense: 35,
//     critChange: 0
//   },
//   canPlay: {
//     knight: true,
//     wizard: true,
//     archer: true,
//     priest: true,
//   }
// }




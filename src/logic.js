function calculateDamage(damage, target) {
  const rawDamage = damage
  const totalDamage = Math.round(rawDamage / (1 + (target.defense / 100)))
  return totalDamage
}

function updateCharacter(state, charKey, changes) {
  const newState = {
    ...state,
    characters: {
      ...state.characters, 
      [charKey]: {
        ...state.characters[charKey], ...changes
      }
    }
  }
  return newState
}

function updateEnemy(state, enemy, changes) {
  const newState = {
    ...state,
    enemy: {
      ...enemy, ...changes
    }
  }
  return newState
}

export function playerAttack(state, action) {
  const attacker = state.characters[action.payload.attackerKey]
  const target = state[action.payload.target]
  const totalDamage = calculateDamage(attacker.damage, target)
  const targetHealth = Math.round(target.health - totalDamage)
  const enemyChanges = { health: targetHealth }
  const newState = updateEnemy(state, target, enemyChanges)
  return newState
}

export function playerBlock(state, action) {
  const { blockerKey } = action.payload;
  const blocker = state.characters[blockerKey]
  const newHealth = Math.round(blocker.health + (blocker.defense / 2))
  const characterChanges = { health: newHealth }
  const newState = updateCharacter(state, blockerKey, characterChanges)
  return newState
}

export function playerSkill(state, action) {
  const attacker = state.characters[action.payload.attacker]
  const skillKey = action.payload.skill
  const skill = attacker.skills[skillKey]
  const enemy = state[action.payload.target]
  switch (action.payload.type) {
    case 'ATTACK': {
      const damage = calculateDamage(skill.damage, enemy)
      let damageOverTime = skill.damageOverTime || 0
      const newHealth = enemy.health - (damage + damageOverTime)
      const changes = { health: newHealth }
      const newState = updateEnemy(state, enemy, changes)
      return newState
    }
  }
}
// const initialState = {
//   characters: {
//     knight: {
//       name: 'knight',
//       health: 105,
//       damage: 15,
//       defense: 43,
//       critChance: 0,
//       skills: {
//         shieldBash: {
//           damage: 10,
//           damageOverTime: 2,
//         }
//       }
//     },
//     wizard: {
//       name: 'wizard',
//       health: 65,
//       damage: 38,
//       defense: 18,
//       critChance: 0,
//     },
//     archer: {
//       name: 'archer',
//       health: 88,
//       damage: 26,
//       defense: 22,
//       critChance: 0,
//     },
//     priest: {
//       name: 'priest',
//       health: 82,
//       damage: 8,
//       defense: 30,
//       critChance: 0,
//     },
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



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

function addChanges(health, defense) {
  return {
    health: health,
    defense: defense
  }
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
  const attackerKey = action.payload.attacker
  const attacker = state.characters[action.payload.attacker]
  const skillKey = action.payload.skill
  const skill = attacker.skills[skillKey]
  const target = state[action.payload.target]
  // console.log(skill)
  switch (action.payload.type) {
    case 'ATTACK': {
      const damage = calculateDamage(skill.damage, target)
      let damageOverTime = skill.damageOverTime || 0
      const newHealth = target.health - (damage + damageOverTime)
      const newDefense = target.defense + (skill.defense)
      const changes = addChanges(newHealth, newDefense)
      const newState = updateEnemy(state, target, changes)
      return newState
    }
    case 'BUFF': {
      const newHealth = attacker.health
      const newDefense = attacker.defense + skill.defense
      const changes = addChanges(newHealth, newDefense)
      const newState = updateCharacter(state, attackerKey, changes)
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



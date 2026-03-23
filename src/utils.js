export function calculateDamage(damage, target) {
  const totalDamage = Math.round(damage / (1 + (target.defense / 100)))
  return totalDamage
}

export function updateCharacter(state, charKey, changes) {
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

export function updateEnemy(state, enemy, changes) {
  const newState = {
    ...state,
    enemy: {
      ...enemy, ...changes
    }
  }
  return newState
}

export function addChanges(health, damage, defense) {
  return {
    health: health,
    damage: damage,
    defense: defense,
  }
}

export function weightedRandom(options) {
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) return option.name;
  }
}   



function calculateDamage(damage, target) {
  const totalDamage = Math.round(damage / (1 + (target.defense / 100)))
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

export function playerBlock(state, action) { //REVISI Sangat underwhelming
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
  switch (skill.type) {
    case 'DAMAGE': {
      const damage = calculateDamage(skill.damage, target)
      let damageOverTime = skill.damageOverTime || 0

      //Enemy changes
      const enemyHealth = target.health - (damage + damageOverTime)
      let enemyDefense = target.defense

      if (skill.defense) enemyDefense = target.defense + (skill.defense) 

      const enemyChanges = addChanges(enemyHealth, enemyDefense)
      const enemyState = updateEnemy(state, target, enemyChanges)
      enemyState

      //Character changes
      let characterHealth = attacker.health
      let characterDefense = attacker.defense

      if (skill.defenseSelf) characterDefense = attacker.defense + skill.defenseSelf
      if (skill.healthSelf) characterHealth = attacker.health + skill.health

      const characterChanges = addChanges(characterHealth, characterDefense)
      const characterState = updateCharacter(enemyState, attackerKey, characterChanges)
      return characterState
    }
    case 'BUFF': {
      const newHealth = attacker.health + skill.healthSelf || attacker.health
      const newDefense = attacker.defense + skill.defenseSelf || attacker.defense
      const changes = addChanges(newHealth, newDefense)
      const newState = updateCharacter(state, attackerKey, changes)
      return newState
    }
  }
}

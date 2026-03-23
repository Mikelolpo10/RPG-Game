import { calculateDamage, updateCharacter, updateEnemy, addChanges, weightedRandom } from './utils.js'

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

      // Enemy changes
      const enemyHealth = target.health - (damage + damageOverTime)
      const enemyDamage = target.damage
      let enemyDefense = target.defense

      if (skill.defense) enemyDefense = target.defense + skill.defense

      const enemyChanges = addChanges(enemyHealth, enemyDamage, enemyDefense)
      const enemyState = updateEnemy(state, target, enemyChanges)

      // Character changes
      let characterHealth = attacker.health
      let characterDamage = attacker.damage
      let characterDefense = attacker.defense

      if (skill.healthSelf) characterHealth = attacker.health + skill.healthSelf     // fix: was skill.health
      if (skill.damageSelf) characterDamage = attacker.damage + skill.damageSelf     // fix: was skill.damage
      if (skill.defenseSelf) characterDefense = attacker.defense + skill.defenseSelf

      const characterChanges = addChanges(characterHealth, characterDamage, characterDefense)
      const characterState = updateCharacter(enemyState, attackerKey, characterChanges)
      return characterState
    }
    case 'BUFF': {
      const newHealth = attacker.health + (skill.healthSelf ?? 0)     // fix: was || fallback
      let newDamage = attacker.damage
      const newDefense = attacker.defense + (skill.defenseSelf ?? 0)  // fix: was || fallback
      const changes = addChanges(newHealth, newDamage, newDefense)
      const newState = updateCharacter(state, attackerKey, changes)
      return newState
    }
    case 'DEBUFF': {
      const enemyHealth = target.health + (skill.health ?? 0)    // fix: was || fallback
      const enemyDamage = target.damage + (skill.damage ?? 0)    // fix: was || fallback
      const enemyDefense = target.defense + (skill.defense ?? 0) // fix: was || fallback
      const changes = addChanges(enemyHealth, enemyDamage, enemyDefense)
      const newState = updateEnemy(state, target, changes)
      return newState
    }
    case 'HEAL': {
      const characterHealth = attacker.health + skill.heal
      let characterDamage = attacker.damage
      const characterDefense = attacker.defense
      const changes = addChanges(characterHealth, characterDamage, characterDefense)
      const newState = updateCharacter(state, attackerKey, changes)
      return newState
    }
    default:                                                          // fix: added default case
      console.warn(`Unknown skill type: ${skill.type}`)
      return state
  }
}

export function enemyTurn(state, action) {
  const moveOptions = [
    { name: 'ATTACK', weight: 100 },
    { name: 'BLOCK', weight: 0 },
    { name: 'SKILL', weight: 0 },
  ]

  switch (weightedRandom(moveOptions)) {
    case 'ATTACK': {
      return enemyAttack(state) 
    }
  }
  
}

function enemyAttack(state) {
  const enemy = state.enemy
  const targetOptions = Object.keys(state.characters).map((o) => {
    return {
      name: o,
      weight: 25
    }
  })
  const targetKey = weightedRandom(targetOptions) 
  const target = state.characters[targetKey]
  const totalDamage = calculateDamage(enemy.damage, target)
  const targetHealth = target.health - totalDamage
  const targetDamage = target.damage
  const targetDefense = target.defense
  const targetChanges = addChanges(targetHealth, targetDamage, targetDefense)
  const targetState = updateCharacter(state, targetKey, targetChanges)
  return targetState
}


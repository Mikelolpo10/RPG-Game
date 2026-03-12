export function attack(characters, attacker, victim, setter, turnOver) {
  if (turnOver.current) return

  characters.map((c) => {
    if (c.name === attacker || c.name === victim) {
      if (victim.name === 'enemy') {
        const newHealth = victim.health - c.damage
        setter(victim.health = newHealth)
      } else {
        const newHealth = c.health - attacker.damage
        c.health = newHealth
        setter([...characters])
      }
    }
  })
  turnOver.current = !turnOver.current 
}










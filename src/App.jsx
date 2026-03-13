import { useState, useEffect, useRef, useReducer, act } from 'react'
import Enemy from './components/Enemy.jsx'
import PlayerAction from './components/PlayerAction.jsx'
import { playerAttack, playerBlock } from './logic.js'
import knight from './assets/knight.png'
import wizard from './assets/wizard.png'
import archer from './assets/archer.png'
import priest from './assets/priest.png'
import './App.css'

function App() {
  const [selectedChar, setSelectedChar] = useState('knight')
  const images = {
    knight,
    wizard,
    archer,
    priest,
  }
  const initialStats = {
    characters: {
      knight: { name: 'knight', health: 105, damage: 18, defense: 43, critChance: 0 },
      wizard: { name: 'wizard', health: 65, damage: 38, defense: 18, critChance: 0 },
      archer: { name: 'archer', health: 88, damage: 26, defense: 22, critChance: 0 },
      priest: { name: 'priest', health: 82, damage: 8, defense: 30, critChance: 0 },
    },
    enemy: {
      name: 'enemy',
      health: 300,
      damage: 30,
      defense: 35,
      critChange: 0
    }
  }
  const [state, dispatch] = useReducer(reducer, initialStats)

  // Testing
  useEffect(() => {
    console.log(state)
    console.log(selectedChar)
  }, [initialStats])

  function reducer(state, action) {
    switch (action.type) {
      case 'ATTACK':
        return playerAttack(state, action)
      case 'BLOCK':
        return playerBlock(state, action)

      default:
        console.log(`idk`)
        return state
    }
  }
  return (
    <>
      <main>
        <Enemy
          stats={state.enemy}
        />

        <div id="player-characters-container">
          {Object.entries(state.characters).map(([name], index) => {
            return (
              <div key={name} className={`character ${name === selectedChar ? 'is-active': ''}`} onClick={() => setSelectedChar(name)}>
                <img 
                  src={images[name]} 
                  alt={name} 
                  style={index <= 1 ? { transform: 'scaleX(-1)' } : {}} 
                />
              </div>
            )
          })}
        </div>

        <div id="player-action-container">
          <PlayerAction action='Attack' onClick={() => dispatch({ type: 'ATTACK', payload: { attacker: 'knight', target: 'enemy' } })} />
          <PlayerAction action='Block' onClick={() => dispatch({ type: 'BLOCK', payload: { blocker: 'priest' } })} />
          <PlayerAction action='Action' />
          <PlayerAction action='Menu' />
        </div>

        <aside>
          <div id="player-stats">
            {Object.entries(state.characters).map(([charName, charStats]) => (
              <div key={charName}>
                {Object.entries(charStats).map(([statName, value]) => (
                  <p key={statName}>{value}</p>
                ))}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </>
  )
}

export default App

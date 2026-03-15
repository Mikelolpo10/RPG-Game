import { useState, useEffect, useRef, useReducer } from 'react'
import Enemy from './components/Enemy.jsx'
import PlayerAction from './components/PlayerAction.jsx'
import { playerAttack, playerBlock, playerSkill } from './logic.js'
import knight from './assets/knight.png'
import wizard from './assets/wizard.png'
import archer from './assets/archer.png'
import priest from './assets/priest.png'
import './App.css'

function App() {
  const [selectedChar, setSelectedChar] = useState('knight')
  const turnOver = useRef(false)
  const images = {
    knight,
    wizard,
    archer,
    priest,
  }
  // Knight
  // Shield Bash – Menyerang musuh dengan perisai sehingga mengurangi defense.
  // Fortify – Meningkatkan defense knight selama 2 turn.
  // Heavy Slash – Serangan pedang kuat dengan damage lebih dari attack biasa tapi mengurang defense.
  // Shield Wall — Menyerap damage yang diterima ally dengan rumus rd - (def + allyDef)
  // Wizard
  // Explosion – Serangan api dengan damage tinggi dan memberikan dot untuk 1 turn tapi mengurangi defense dan membuat wizard tidak bisa menyerang pada next turn.
  // Lightning Strike – Serangan petir cepat yang memiliki peluang menembus defense?.
  // Weaken — Memberikan debuff attack 
  // Archer
  // Piercing Arrow – Panah yang menembus armor sehingga sebagian defense musuh diabaikan.
  // Rapid Shot?? – Menembakkan beberapa panah cepat dengan total damage sedang.
  // Focus Aim – Meningkatkan crit chance archer selama 3 turn.
  // Priest
  // Heal – Menyembuhkan HP salah satu anggota tim.
  // Holy Light – Serangan cahaya suci ke musuh dengan damage sedang.
  // Blessing – Memberikan buff ke ally yang meningkatkan defense dan attack.
  // NOTE: Nanti tambah sistem skill kyk honkai starrail jadi skill gbs di spam
  const initialState = {
    characters: {
      knight: {
        name: 'knight',
        health: 105,
        damage: 15,
        defense: 43,
        critChance: 0,
        skills: {
          shieldBash: {
            damage: 10,
            damageOverTime: 2,
          }
        }
      },
      wizard: {
        name: 'wizard',
        health: 65,
        damage: 38,
        defense: 18,
        critChance: 0,
      },
      archer: {
        name: 'archer',
        health: 88,
        damage: 26,
        defense: 22,
        critChance: 0,
      },
      priest: {
        name: 'priest',
        health: 82,
        damage: 8,
        defense: 30,
        critChance: 0,
      },
    },
    enemy: {
      name: 'enemy',
      health: 300,
      damage: 30,
      defense: 35,
      critChange: 0
    },
    canPlay: {
      knight: true,
      wizard: true,
      archer: true,
      priest: true,
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const selectedSkill = useRef('shieldBash')

  function reducer(state, action) {
    switch (action.type) {
      case 'ATTACK':
        state.canPlay[selectedChar] = false
        return playerAttack(state, action)
      case 'BLOCK':
        state.canPlay[selectedChar] = false
        return playerBlock(state, action)
      case 'SKILL':
        state.canPlay[selectedChar] = false
        return playerSkill(state, action)
      default:
        console.log(`ACTION NOT VALID`)
        return state
    }
  }

  // Testing
  useEffect(() => {
    const allDone = Object.values(state.canPlay).every(value => !value)
    turnOver.current = allDone
    // console.log(selectedSkill.current)
  }, [state])

  return (
    <>
      <main>
        <Enemy stats={state.enemy} />

        <div id="player-characters-container">
          {Object.keys(state.characters).map((name, index) => {
            return (
              <div
                key={name}
                className={`character ${name === selectedChar ? 'is-active' : ''}`}
                onClick={() => setSelectedChar(name)}
              >
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
          <PlayerAction
            action='Attack'
            onClick={() => dispatch(
              {
                type: 'ATTACK',
                payload: { attackerKey: selectedChar, target: 'enemy' }
              }
            )}
            disabled={state.canPlay[selectedChar]}
          />
          <PlayerAction
            action='Block'
            onClick={() => dispatch(
              {
                type: 'BLOCK',
                payload: { blockerKey: selectedChar }
              }
            )}
            disabled={state.canPlay[selectedChar]}
          />
          <PlayerAction
            action='Skill'
            onClick={() => dispatch({
              type: 'SKILL',
              payload: {
                skill: selectedSkill.current,
                attacker: selectedChar,
                target: 'enemy',
                type: 'ATTACK'
              }
            })}
            disabled={state.canPlay[selectedChar]}
          />
          <PlayerAction
            action='Item'
          />
        </div>

        <aside>
          <div id="player-stats">
            {Object.entries(state.characters).map(([charName, charStats]) => (
              <div key={charName}>
                {Object.entries(charStats).map(([statName, value]) => {
                  if (typeof value === 'object') return null
                  return <p key={statName}>{value}</p>
                })}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </>
  )
}

export default App

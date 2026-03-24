import { motion, AnimatePresence, } from 'motion/react'
import { useState, useEffect, useRef, useReducer } from 'react'
import Enemy from './components/Enemy.jsx'
import PlayerAction from './components/PlayerAction.jsx'
import { playerAttack, playerBlock, playerSkill, enemyTurn } from './logic.js'
import { closeSkillsModal, openSkillsModal } from './design.js'
import knight from './assets/images/knight.png'
import wizard from './assets/images/wizard.png'
import archer from './assets/images/archer.png'
import priest from './assets/images/priest.png'
import closeButton from './assets/images/closeX.png'
import './App.css'

function App() {
  const [selectedChar, setSelectedChar] = useState('knight')
  const images = {
    knight,
    wizard,
    archer,
    priest,
  }
  const initialState = {
    characters: {
      knight: {
        name: 'knight',
        health: 1050,
        damage: 150,
        defense: 43,
        critChance: 0,
        skills: {
          shieldBash: {
            type: 'DAMAGE',
            damage: 120,
            defense: -20,
          },
          heavySlash: {
            type: 'DAMAGE',
            damage: 225,
            defense: -10,
          },
          fortify: {
            type: 'BUFF',
            defenseSelf: 30,
          }
        }
      },
      wizard: {
        name: 'wizard',
        health: 650,
        damage: 380,
        defense: 18,
        critChance: 0,
        skills: {
          explosion: {
            type: 'DAMAGE',
            damage: 530,
            defenseSelf: -20,
          },
          inferno: {
            type: 'DAMAGE',
            damage: 100,
          },
          swordPhalanx: {
            type: 'DAMAGE',
            defenseSelf: 15,
          }
        }
      },
      archer: {
        name: 'archer',
        health: 880,
        damage: 260,
        defense: 22,
        critChance: 0,
        skills: {
          heavyArrow: {
            type: 'DAMAGE',
            damage: 320,
          },
          heavySlash: {
            type: 'DAMAGE',
            damage: 225,
            defense: -15,
          },
          focusAim: {
            type: 'DAMAGE',
            damage: 300,
            defense: -10,
          }
        }
      },
      priest: {
        name: 'priest',
        health: 820,
        damage: 80,
        defense: 30,
        critChance: 0,
        skills: {
          heal: {
            type: 'HEAL',
            heal: 100,
          },
          blessing: {
            type: 'BUFF',
            defense: 15,
          },
          weaken: {
            type: 'DEBUFF',
            damage: -50,
            defense: -10,
          }
        }
      },
    },
    enemy: {
      name: 'enemy',
      health: 3000,
      damage: 300,
      defense: 55,
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
  const selectedSkill = useRef('')
  const enemyMove = useRef(false)
  const [isAttacking, setIsAttacking] = useState(false)

  function reducer(state, action) {
    switch (action.type) {
      case 'ATTACK': {
        return updateTurn(state, action)
      }
      case 'BLOCK':
        state.canPlay[selectedChar] = false
        return playerBlock(state, action)
      case 'SKILL':
        state.canPlay[selectedChar] = false
        return playerSkill(state, action)
      case 'ENEMYTURN': {
        return enemyTurn(resetTurn(state), action)
      }
      default:
        console.log(`ACTION NOT VALID`)
        return state
    }
  }

  // Testing
  useEffect(() => {
    const allDone = Object.values(state.canPlay).every(value => !value)

    if (allDone && !enemyMove.current) {
      enemyMove.current = true
      dispatch({ type: 'ENEMYTURN' })
    }

    if (!allDone) {
      enemyMove.current = false
    }
  }, [state])

  function updateTurn(state, action) {
    return playerAttack({
      ...state,
      canPlay: {
        ...state.canPlay,
        [selectedChar]: false
      }
    }, action)
  }

  function resetTurn(state) {
    const canPlay = Object.fromEntries(
      Object.entries(state.canPlay).map(([key, value]) => {
        return [key, true]
      })
    )
    const newState = {
      ...state,
      canPlay
    }
    return newState
  }

  // function attackAnimate() {

  // }

  return (
    <AnimatePresence mode='wait'>
      <main>
        <Enemy stats={state.enemy} />

        <div id="player-characters-container">
          {Object.keys(state.characters).map((name, index) => {
            return (
              <motion.div
                key={name}
                className={`character ${name === selectedChar ? 'is-active' : ''}`}
                onClick={() => setSelectedChar(name)}
                animate={{
                  rotateZ: isAttacking && selectedChar === name ? 45 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <img
                  src={images[name]}
                  alt={name}
                  style={index <= 1 ? { transform: 'scaleX(-1)' } : {}}
                />
              </motion.div>
            )
          })}
        </div>

        <div id="player-action-container">
          <PlayerAction
            action='Attack'
            onClick={() => {
              dispatch(
                {
                  type: 'ATTACK',
                  payload: { attackerKey: selectedChar, target: 'enemy' }
                }
              )
              setIsAttacking(true)
              setTimeout(() => setIsAttacking(false), 400)
            }}
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
            onClick={() => {
              openSkillsModal()
            }}
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

        <div id="skills-modal">
          <div id="modal-header">
            <div id="close-modal-button" onClick={closeSkillsModal}>
              <img src={closeButton} alt="close button" />
            </div>
          </div>
          <div id="character-skills">
            {Object.keys(state.characters[selectedChar].skills).map((skillName) => (
              <div
                key={skillName}
                className="skill-card"
                onClick={() => {
                  selectedSkill.current = skillName
                  closeSkillsModal()
                  dispatch({
                    type: 'SKILL',
                    payload: {
                      skill: selectedSkill.current,
                      attacker: selectedChar,
                      target: 'enemy',
                    }
                  })
                }}
              >
                {skillName}
              </div>
            ))}
          </div>
        </div>
      </main>
    </AnimatePresence>
  )
}

export default App

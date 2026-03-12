import { useState } from 'react'
import Enemy from './components/Enemy.jsx'
import PlayerAction from './components/PlayerAction.jsx'
import knight from './assets/knight.png'
import wizard from './assets/wizard.png'
import archer from './assets/archer.png'
import priest from './assets/priest.png'
import './App.css'

function App() {

  return (
    <main>
      <Enemy />

      <div id="player-characters-container">
        <img src={knight} alt="" style={{transform: 'scaleX(-1)' }} />
        <img src={wizard} alt="" style={{transform: 'scaleX(-1)' }} />
        <img src={archer} alt="" />
        <img src={priest} alt="" />
      </div>

      <div id="player-action-container">
        <PlayerAction action='Attack' />
        <PlayerAction action='Block' />
        <PlayerAction action='Action' />
        <PlayerAction action='Menu' />
      </div>
    </main>
  )
}

export default App

import { useState, useEffect, useMemo } from 'react';
import enemyImg from '../assets/enemy.png'
import './Enemy.css'

export default function Enemy({stats}) {
  const enemyLines = {
    taunt: [
      "Well, look what we have here.",
      "You're not supposed to be here.",
      "That was a mistake.",
      "So you chose a fight.",
      "That all you got?",
      "You're slower than I thought.",
      "Try harder.",
      "You call that a hit?",
      "Not impressed."
    ],

    attacking: [
      "Catch this!",
      "Move.",
      "Too slow.",
      "Stay down.",
      "Get better",
      "Gotcha!",
      "There!",
      "Nice try.",
      "Ez"
    ],

    attacked: [
      "Tch...",
      "Lucky hit.",
      "You got me...",
      "Watch it.",
      "Damn it.",
      "Alright, that hurt.",
      "Cheap shot.",
      "You're getting annoying.",
      "Light work no reaction"
    ]
  };

  const [enemyLine, setEnemyLine] = useState('')
  const randomNum = useMemo(() => Math.random(), []);
  const getEnemyLine = (type) => {
    const lines = enemyLines[type]
    return lines[Math.floor(randomNum * lines.length)]
  }

  useEffect(() => {
    setEnemyLine(getEnemyLine('taunt'))
  }, [])

  return (
    <div id='enemy-container'>
      <img id='enemy-img' src={enemyImg} alt='enemy.png' />
      <div id="dialog-box">
        <div id="dialog-arrow"></div>
        {enemyLine.length !== 0 ? enemyLine : ''}
      </div>
      <div id='enemy-debug-stats'>
        <h5>Stats</h5>
        <p>{stats.health}</p>
        <p>{stats.damage}</p>
        <p>{stats.defense}</p>
        <p>{stats.critChange}</p>
      </div>
    </div>
  )
}
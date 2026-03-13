import './PlayerAction.css'

export default function PlayerAction({action, onClick}) {
  return (
    <div className='player-action-card' onClick={onClick}>
      <h1>{action}</h1>
    </div>
  )
}







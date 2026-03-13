import './PlayerAction.css'

export default function PlayerAction({action, onClick, disabled = true}) {
  return (
    <button 
      className={`player-action-card ${!disabled ? 'disabled' : ''}`} 
      onClick={onClick}
      disabled={!disabled}
    >
      <h1>{action}</h1>
    </button>
  )
}







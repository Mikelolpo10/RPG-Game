import './PlayerAction.css'

export default function PlayerAction({ action, onClick, disabled = true }) {
  return (
    <button
      className="flex w-32 cursor-pointer select-none items-center justify-center border border-white bg-transparent p-4 disabled:cursor-default disabled:border-gray-500 disabled:text-gray-500"
      onClick={onClick}
      disabled={!disabled}
    >
      <h1>{action}</h1>
    </button>
  )
}







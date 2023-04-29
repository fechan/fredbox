export function MainMenu({onJoinRoomClicked, onCreateRoomClicked}) {
  return (
    <div>
      <h2>Main menu</h2>
      <button onClick={ onJoinRoomClicked }>Join room</button>
      <button onClick={ onCreateRoomClicked }>Create room</button>
    </div>
  )
}
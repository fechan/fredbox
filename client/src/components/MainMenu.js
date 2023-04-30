export function MainMenu({onJoinRoomClicked, onCreateRoomClicked}) {
  return (
    <div>
      <h2>Main menu</h2>
      <button class="btn btn-primary" onClick={ onJoinRoomClicked }>Join room</button>
      <button class="btn btn-outline-primary" onClick={ onCreateRoomClicked }>Create room</button>
    </div>
  )
}
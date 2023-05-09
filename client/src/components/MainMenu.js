export function MainMenu({onJoinRoomClicked, onCreateRoomClicked}) {
  return (
    <div>
      <h2 class="fw-bold">Main menu</h2>
      <button className="btn btn-primary" onClick={ onJoinRoomClicked }>Join room</button>
      <button className="btn btn-outline-primary" onClick={ onCreateRoomClicked }>Create room</button>
    </div>
  )
}
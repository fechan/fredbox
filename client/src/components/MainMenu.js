export function MainMenu({onJoinRoomClicked, onCreateRoomClicked}) {
  return (
    <div>
      <h2 className="fw-bold">Main menu</h2>
      <p className="lead fw-bold">This is a game where you compete against your friends in simple brain games</p>
      <button className="btn btn-primary" onClick={ onJoinRoomClicked }>Join room</button>
      <button className="btn btn-outline-primary" onClick={ onCreateRoomClicked }>Create room</button>
    </div>
  )
}
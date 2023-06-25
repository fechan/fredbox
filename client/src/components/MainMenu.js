import { Button } from "./Button";

export function MainMenu({onJoinRoomClicked, onCreateRoomClicked}) {
  return (
    <div>
      <h2 className="fw-bold">Main menu</h2>
      <p className="lead fw-bold">This is a game where you compete against your friends in simple brain games</p>
      <Button className="btn btn-primary" onClick={ onJoinRoomClicked }>Join room</Button>
      <Button className="btn btn-outline-primary" onClick={ onCreateRoomClicked }>Create room</Button>
    </div>
  )
}
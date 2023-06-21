import { useTimer } from "react-timer-hook";

export function GameStartCountdown({ seconds, onCountdownEnded }) {

  const gameStartTime = new Date();
  gameStartTime.setSeconds(gameStartTime.getSeconds() + 3);
  const timer = useTimer({ expiryTimestamp: gameStartTime, onExpire: onCountdownEnded, autoStart: true });

  return (timer.totalSeconds > 0) && (
    <div className="GameStartCountdown">
      <h2>The game will start in</h2>
      <span className="time-left">{ timer.totalSeconds }</span>
    </div>
  )
}
import { useEffect, useState } from "react"

export function GameStartCountdown({ seconds, onCountdownEnded }) {

  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect( () => {
    const timeout = setTimeout(() => {
      setTimeLeft(timeLeft - .1);
      if (timeLeft <= .5) {
        onCountdownEnded();
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [timeLeft, onCountdownEnded]);

  return (Math.round(timeLeft) > 0) ? (
    <div className="GameStartCountdown">
      <h2>The game will start in</h2>
      <span className="time-left">{ Math.round(timeLeft) }</span>
    </div>
  ) : (
    <></>
  )
}
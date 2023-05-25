import { useEffect, useState } from "react"

export function GameStartCountdown({ seconds, onCountdownEnded }) {

  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect( () => {
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
      if (timeLeft <= 1) {
        onCountdownEnded();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onCountdownEnded]);

  return (timeLeft > 0) ? (
    <div className="GameStartCountdown">
      <h2>The game will start in</h2>
      <span className="time-left">{ timeLeft }</span>
    </div>
  ) : (
    <></>
  )
}
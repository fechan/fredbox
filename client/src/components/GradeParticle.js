import { useState, useEffect } from "react";

export function GradeParticle({ keyName, gradeParticles, setGradeParticles, points, top, left }) {
  const g = 9.81 / 20;
  const INITIAL_Y_VELOCITY = -10;

  const [xVelocity, setXVelocity] = useState(
    Math.floor(Math.random() * 7) - 3
  );
  const [yVelocity, setYVelocity] = useState(INITIAL_Y_VELOCITY);
  const [position, setPosition] = useState({ top, left });
  const [display, setDisplay] = useState("inline");

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (position.top > window.screen.height | position.left > window.screen.width | position.left < 0) {
        setDisplay("none");
        clearInterval(intervalId);
      } else {
        const newVelocityY = yVelocity + g;
        const newVelocityX = xVelocity;
        const newPosition = {
          top: position.top + newVelocityY,
          left: position.left + newVelocityX,
        };
        setYVelocity(newVelocityY);
        setPosition(newPosition);
      }
    }, 1000 / 60);

    return () => clearInterval(intervalId);
  }, [position, xVelocity, yVelocity]);

  return (
    <span inert="true" className="fw-bold h1" style={{
      position: "absolute",
      top: position.top,
      left: position.left,
      display: display,
      color: (points > 0) ? "green" : "red",
      textShadow: "3px 3px 0px white"
    }}>
      { points }
    </span>
  )
}
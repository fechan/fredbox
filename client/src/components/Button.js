import hover from "../sounds/hover.mp3"
import click from "../sounds/click.mp3"

export function Button({ onMouseEnter, onClick, children, ...props }) {

  function onMouseEnterWithSound(event) {
    const audio = new Audio(hover);
    audio.play();
    if (onMouseEnter) onMouseEnter(event);
  }
  
  function onClickWithSound(event) {
    const audio = new Audio(click);
    audio.play();
    if (onClick) onClick(event);
  }

  return <button onClick={ onClickWithSound } onMouseEnter={ onMouseEnterWithSound } { ...props }>{ children }</button>
}
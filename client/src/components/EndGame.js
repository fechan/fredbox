export function EndGame({ scores, onBackClicked, onPlayAgainClicked }) {
  const scoreboardItems = scores.map(score =>
    <li key={score.playerName}>{score.playerName}: {score.score}</li>
  );

  return ( 
    <div>
      <h2>Scores:</h2>
      <ol>{ scoreboardItems }</ol>
      <button className="btn btn-primary" onClick={ onPlayAgainClicked }>Play again</button>
      <button className="btn btn-back" onClick={ onBackClicked }>Exit to main menu</button>
    </div>
  )
}
export function EndGame({ scores, onBackClicked, onPlayAgainClicked }) {
  const scoreboardItems = scores.map((score, i) =>
    <li key={score.playerName} className="d-flex justify-content-between">
      <span>{i+1}. {score.playerName}</span>
      <span>{score.score}</span>
    </li>
  );

  return ( 
    <div>
      <h2>Scores</h2>
      <ol className="h4 text-start px-0">{ scoreboardItems }</ol>
      <button className="btn btn-primary" onClick={ onPlayAgainClicked }>Play again</button>
      <button className="btn btn-back" onClick={ onBackClicked }>Exit to main menu</button>
    </div>
  )
}
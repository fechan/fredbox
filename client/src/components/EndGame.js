export function EndGame({scores}) {
  const scoreboardItems = scores.map(score =>
    <li key={score.playerName}>{score.playerName}: {score.score}</li>
  );

  return ( 
    <div>
      <h2>Scores:</h2>
      <ol>{ scoreboardItems }</ol>
    </div>
  )
}
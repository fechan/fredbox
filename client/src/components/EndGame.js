export function EndGame({scores}) {
  const scoreboardItems = scores.map(score =>
    <li key={score.playerName}>{score.playerName}: {score.score}</li>
  );

  return ( 
    <div>
      <ol>{ scoreboardItems }</ol>
    </div>
  )
}
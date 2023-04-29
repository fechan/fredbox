export function EndGame({scores}) {
  return ( 
    <div>
      <ol>
        {
          scores.map(score => {
            return <li key={score.playerName}>{score.playerName}: {score.score}</li>;
          })
        }
      </ol>
    </div>
  )
}
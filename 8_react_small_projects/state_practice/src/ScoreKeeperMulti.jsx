import { useState } from "react";

export default function ScoreKeeperMulti({ numPlayers=3, target=5 }){
    
    const [scores, setScores] = useState(new Array(numPlayers).fill(0));

    const incrementScore = (index) => {
        console.log("Player " + index + " +1");
        setScores(prevScores => {
            return prevScores.map((score, i) => {
                if(i === index){
                    return score + 1;
                } else {
                    return score;
                };
            });
        });
    };

    const reset = () => {
        setScores(new Array(numPlayers).fill(0));
    };

    return(
        <div>
            <h1>Score Keeper</h1>
            <ul>
                {scores.map((score, index) => {
                    return (
                    <li key={index}>
                        Player{index + 1}: {score}
                        <button onClick={() => {incrementScore(index)}}>+1</button>
                        {score >= target && "WINNER!" }
                        </li>
                    )
                })}
            </ul>
            <button onClick={reset}>Reset</button>
        </div>
    );
};
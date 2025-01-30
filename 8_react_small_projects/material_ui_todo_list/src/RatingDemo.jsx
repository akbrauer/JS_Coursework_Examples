import { useState } from "react";
import Rating from "@mui/material/Rating";

export default function RatingDemo(){
    const [score, setScore] = useState(3);
    return(
        <div>
            <h1>Rating Demo:  Current Rating: {score}</h1>
            <Rating
                name="simple-controlled"
                value={score}
                onChange={(event, newValue) => {
                    setScore(newValue)
                }}
            />
        </div>
    )
}
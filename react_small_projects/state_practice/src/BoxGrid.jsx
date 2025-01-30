import Box from "./Box";
import { useState } from "react";

export default function BoxGrid() {
	const [boxes, setBoxes] = useState([false, false, false, false, false, false, false, false, false]);

    const toggleBox = (idx) => {
        setBoxes((oldBoxes => {
            return oldBoxes.map((value, index) => {
                if(index === idx){
                    return !value;
                } else {
                    return value;
                };
            });
        }));
    };

    const resetBoxes = () => {
        setBoxes([false, false, false, false, false, false, false, false, false])
    }
	return (
		<div className="BoxGrid">
			{boxes.map((b, i) => {
                return <Box key={i} isActive={b} clickFunc={ () => toggleBox(i) }/>
            })}

			<button onClick={resetBoxes}>Reset</button>
		</div>
	);
}
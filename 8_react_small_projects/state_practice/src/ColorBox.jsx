import { useState } from "react";
import "./ColorBox.css";

export default function ColorBox(){
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    const [color, setColor] = useState(`rgb(${r},${g},${b})`);
    const changeColor = () => {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        setColor(`rgb(${r},${g},${b})`);
    }
    return(
        <div style={{backgroundColor: color}} className='colorBox' onClick={changeColor}></div>
    )
}
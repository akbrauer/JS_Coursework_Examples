import ColorBox from "./ColorBox";
import "./ColorBox.css";

export default function ColorGrid(){
    const boxes = [];
    for(let i = 0; i < 25; i++){
        boxes.push(<ColorBox key={i}/>)
    }
    return(
        <div className="colorGrid">{ boxes }</div>
    )
}
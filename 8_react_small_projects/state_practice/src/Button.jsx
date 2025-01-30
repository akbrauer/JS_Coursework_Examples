import "./Button.css";

export default function Button({ clickFunc, text="Click Me" }){
    return(
        <button className="Button" onClick={clickFunc}>{text}</button>
    )
}
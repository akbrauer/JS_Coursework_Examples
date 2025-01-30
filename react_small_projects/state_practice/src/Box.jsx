import "./Box.css";

export default function Box({ isActive, clickFunc }){
    
    return(
      <div className="Box" onClick={clickFunc} style={{backgroundColor: isActive ? "red" : "black"}}></div>

    )
}
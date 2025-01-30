import Die from "./Die";
import "./Dice.css";

export default function Dice({ dice, color }){
    return(
        <section className="Dice">
            {dice.map((value, index) => {
                return <Die key={index} val={value} color={color} />
            })}
        </section>
    )
}
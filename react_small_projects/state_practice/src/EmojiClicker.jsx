import { useState } from "react";
import { v4 as uuid } from "uuid";

function randomEmoji(){
    const choices = ["😃", "😍", "😭", "😳", "😎", "🤬", "🤢"];
    return choices[Math.floor(Math.random() * choices.length)];
}

export default function EmojiClicker(){
    let [emojis, setEmojis] = useState([{id: uuid(), emoji: randomEmoji()}]);
    let addEmoji = () => {
        setEmojis(oldEmojis => {
            return [...oldEmojis, {id: uuid(), emoji: randomEmoji()}]
        });
    }
    let deleteEmoji = (id) => {
        console.log(id);
        setEmojis(oldEmojis => {
            return [...oldEmojis].filter(e => e.id !== id)
        });
    }
    let makeHearts = () => {
        setEmojis(oldEmojis => {
            return oldEmojis.map(e => {
                return {...e, emoji: "❤️"};
            });
        });
    };
    return(
        <div>
            {emojis.map(e => (
                <span onClick={() => deleteEmoji(e.id)} key={e.id} style={{ fontSize: '4rem' }}>{e.emoji}</span>
            ))}
            <button onClick={addEmoji}>Add Emoji</button>
            <button onClick={makeHearts}>Make Them All Hearts!</button>
        </div>
    )
}
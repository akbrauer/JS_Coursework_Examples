import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import VolumeUp from "@mui/icons-material/VolumeUp";

export default function FormDemo(){
    const [name, setName] = useState("");
    const updateName = (e) => {
        setName(e.target.value);
    };

    const [volume, setVolume] = useState(50);
    const changeVolume = (e, newVal) => {
        setVolume(newVal);
    };

    return(
        <Box sx={{border: "1px solid red", p: 6 , width: 300, height: 300, margin: "0 auto"}}>
            <h1>Name is: {name}</h1>
            <TextField id="outlined-basic" label="Puppy Name" variant="outlined" placeholder="Fido" value={name} onChange={updateName}/>
            <h2>Volume is: {volume}</h2>
            <Slider aria-label="Volume" value={volume} onChange={changeVolume} />
                <VolumeUp />
        </Box>
    )
}
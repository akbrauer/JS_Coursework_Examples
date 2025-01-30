import "./App.css";

// import Lucky7 from "./Lucky7";
import ColorGrid from "./ColorGrid";
import LuckyN from "./LuckyN";
import BoxGrid from "./BoxGrid";
import EmojiClicker from "./EmojiClicker";
// import ScoreKeeper from "./ScoreKeeper";
import ScoreKeeperMulti from "./ScoreKeeperMulti";

import { sum } from "./utils";
function lessThan4(dice) {
	return sum(dice) < 4;
}
  function allSameValue(dice) {
	return  dice.every(v => v === dice[0]);
}

function App() {
	return (
		<>
			<h1>Using State</h1>
			<ColorGrid/>
			{/* <Lucky7/> */}
			<LuckyN winCheck={lessThan4} title="Roll less than 4" />
			<LuckyN winCheck={allSameValue} numDice={3} title="Roll the same number" />
			<BoxGrid />
			<EmojiClicker />
			{/* <ScoreKeeper/> */}
			<ScoreKeeperMulti numPlayers={10} target={5} />
		</>
	);
}

export default App;

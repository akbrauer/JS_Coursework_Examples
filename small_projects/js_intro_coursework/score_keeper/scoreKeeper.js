const p1 = {
    score: 0,
    button: document.querySelector('#p1Btn'),
    display: document.querySelector('#p1Display')
}
const p2 = {
    score: 0,
    button: document.querySelector('#p2Btn'),
    display: document.querySelector('#p2Display')
}

const resetBtn = document.querySelector('#resetBtn');
const playToSelect = document.querySelector('#playTo');
const scoreAlert = document.querySelector('#scoreAlert');

let winningScore = 5;
let isGameOver = false;

function updateScore(player, opponent){
    if(!isGameOver){
        player.score++;
        if (player.score >= winningScore && (player.score - opponent.score > 1)) {
            isGameOver = true;
            player.display.classList.add('has-text-success');
            opponent.display.classList.add('has-text-danger');
            player.button.disabled = true;
            opponent.button.disabled = true;
            scoreAlert.classList.add('is-hidden');
        } else if (player.score >= winningScore && (player.score - opponent.score === 1)){
            scoreAlert.innerText = 'Player must lead by 2 to win!';
            scoreAlert.classList.remove('is-hidden');
        }
        player.display.innerText = player.score;
    };
};

function reset() {
    isGameOver = false;
    for (let p of [p1, p2]){
        p.score = 0;
        p.display.textContent = 0;
        p.display.classList.remove('has-text-success', 'has-text-danger');
        p.button.disabled = false;
    };
};

p1.button.addEventListener('click', function(){
    updateScore(p1, p2);
});
p2.button.addEventListener('click', function(){
    updateScore(p2, p1);
});

resetBtn.addEventListener('click', reset);

playToSelect.addEventListener('change', function(){
    winningScore = parseInt(this.value);
    reset();
});
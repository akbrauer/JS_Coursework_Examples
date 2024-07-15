const p1Btn = document.querySelector('#p1Btn');
const p2Btn = document.querySelector('#p2Btn');
const resetBtn = document.querySelector('#resetBtn');
const playToSelect = document.querySelector('#playTo');
const p1Display = document.querySelector('#p1Display');
const p2Display = document.querySelector('#p2Display');

let p1Score = 0;
let p2Score = 0;
let winningScore = 3;
let isGameOver = false;

p1Btn.addEventListener('click', function(){
    if(!isGameOver){
        p1Score++;
        if (p1Score === winningScore) {
            isGameOver = true;
            p1Display.classList.add('has-text-success');
            p2Display.classList.add('has-text-danger');
            p1Btn.disabled = true;
            p2Btn.disabled = true;
        };
        p1Display.innerText = p1Score;
    };
});
p2Btn.addEventListener('click', function(){
    if(!isGameOver){
        p2Score++;
        if (p2Score === winningScore) {
            isGameOver = true;
            p2Display.classList.add('has-text-success');
            p1Display.classList.add('has-text-danger');
            p1Btn.disabled = true;
            p2Btn.disabled = true;
            
        };
        p2Display.innerText = p2Score;
    };
});

resetBtn.addEventListener('click', reset);

playToSelect.addEventListener('change', function(){
    winningScore = parseInt(this.value);
    reset();
});

function reset() {
    p1Score = 0;
    p2Score = 0;
    isGameOver = false;
    p1Display.innerText = 0;
    p2Display.innerText = 0;
    p1Display.classList.remove('has-text-success', 'has-text-danger');
    p2Display.classList.remove('has-text-success', 'has-text-danger');
    p1Btn.disabled = false;
    p2Btn.disabled = false;
};
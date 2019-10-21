const cards = Array.from(document.querySelectorAll('.cards'));
const startButton = document.querySelector('.start');
const resetButton = document.querySelector('.reset');
const timeDis = document.querySelector('.time');
const click = document.querySelector('.click');
const wrong = document.querySelector('.wrong');
const correct = document.querySelector('.correct');
let score = 0;
const cpics = [ 
    'crookshanks.png',
    'dolphin.png',
    'elephant.png',
    'hedwig.png',
    'lion.png',
    'octopus.png',
    'pig.png',
    'rabbit.png'
];

let isStartButtonClicked = false;
let gameOver = true;
let crd = [0,3,4,2,3,5,4,6,1,7,0,6,1,2,5,7];
let isClicked = [
                false,false,false,false,
                false,false,false,false,
                false,false,false,false,
                false,false,false,false
            ];
let isDone = [
                false,false,false,false,
                false,false,false,false,
                false,false,false,false,
                false,false,false,false
            ];

let isHalf = false,lastClicked;
let curTime = new Date();
let myTimer;

let toggled = false;

function flip(){
    let x = this.id;
    let y = x.split('');
    y.splice(0,1);
    y=y.join('');
    let front = cards[y].querySelector('.front');
    let back =  cards[y].querySelector('.back');
    if(!isClicked[y]){
      front.style.display = 'inline-block';
      back.style.display = 'none';
      click.play();
      if(lastClicked!=y)
        isHalf = !isHalf;
      if(!isHalf){
        if(y!=lastClicked && crd[y]==crd[lastClicked]){
          setTimeout(function(){
            correct.play();
            front.src = 'Images/black.jpg';
            back.src = 'Images/black.jpg';
            cards[y].removeEventListener('dblclick',flip);
            isDone[y]  =true;
            front = cards[lastClicked].querySelector('.front');
            back =  cards[lastClicked].querySelector('.back');
            front.src = 'Images/black.jpg';
            back.src = 'Images/black.jpg';
            cards[lastClicked].removeEventListener('dblclick',flip);
            isDone[lastClicked] = true;
            lastClicked = -1;
            score++;
          },200);  
        }
        else {
          setTimeout(function() {
            wrong.play();
            front.style.display = 'none';
            back.style.display = 'block';
            front = cards[lastClicked].querySelector('.front');
            back =  cards[lastClicked].querySelector('.back');
            isClicked[lastClicked] = false;
            isClicked[y] = false;
            front.style.display = 'none';
            back.style.display = 'block';
            lastClicked = -1;
          },800);  
        }
      }
      else{
        lastClicked = y;
      }
    }
    else{
      front.style.display = 'none';
      back.style.display = 'block';  
      click.play();
    }
    if(score==8)
      gameOver = true;
    isClicked[y] = !isClicked[y];
}

function reduceTime(){
    gameOver = true;
    for(let i=0;i<16;++i){
      if(isDone[i]===false){
        gameOver = false;
        break;
      }
    }  

    if(gameOver == true){
      clearInterval(myTimer);
      let audio = document.querySelector('.winner');
      // isStartButtonClicked = false;
      audio.play(); 
      for(let i=0;i<8;++i){
        let front = cards[i].querySelector('.front');
        let back =  cards[i].querySelector('.back');
        front.src = `Images/winner${i}.jpg`;
        back.src = `Images/winner${i}.jpg`;
      }
      return;
    }  
    let secs = curTime.getSeconds();
    let mins = curTime.getMinutes();
    if(mins==0 && (secs-1) == -1){
        gameOver = true;
        clearInterval(myTimer);
        const gameover = document.querySelector('.gameover');
        gameover.play();
        // isStartButtonClicked = false;
        cards.forEach(card => card.removeEventListener('dblclick',flip));
    }
    else if(secs-1 == -1){
        mins = mins-1;
        secs = 59
    }
    else{
        secs--;
    }
    curTime.setSeconds(secs);
    curTime.setMinutes(mins); 
    if(curTime.getSeconds()<10)
      x=0;
    else 
      x='';
    timeDis.innerHTML = '0'+curTime.getMinutes()+':'+x+curTime.getSeconds();  
}

function cardAssign(){
  for(let i=15;i>0;i--){
    const j = Math.floor(Math.random()*i);
    const temp = crd[i];
    crd[i] = crd[j];
    crd[j] = temp;
  }
  isClicked = [
    false,false,false,false,
    false,false,false,false,
    false,false,false,false,
    false,false,false,false
  ];
  isDone = [
    false,false,false,false,
    false,false,false,false,
    false,false,false,false,
    false,false,false,false
];
  cards.forEach(card => {
    card.addEventListener('dblclick',flip)
    let front = card.querySelector('.front');
    let back = card.querySelector('.back');
    back.src = `Images/cardback.jpg`;
    front.src = `Images/${cpics[crd[cards.indexOf(card)]]}`;
    front.style.display = 'none';
    back.style.display = 'block';
  });

  curTime.setMinutes(1);
  curTime.setSeconds(5);
  timeDis.innerHTML = '0'+curTime.getMinutes()+':'+'0'+curTime.getSeconds();
  myTimer = setInterval(reduceTime,1000);         
}
let x;
function startGame() {
    if(isStartButtonClicked===true)
      return;
    isStartButtonClicked = true;
    cardAssign();
    gameOver = false;
}

function resetGame() {
  clearInterval(myTimer);
  cardAssign();
}

startButton.addEventListener('click',startGame);
resetButton.addEventListener('click',resetGame);
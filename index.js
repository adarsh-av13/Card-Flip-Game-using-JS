const cards = Array.from(document.querySelectorAll('.cards'));
const startButton = document.querySelector('button');
const timeDis = document.querySelector('.time');
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
let isHalf = false,lastClicked;
let curTime = new Date();


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
      if(lastClicked!=y)
        isHalf = !isHalf;
      if(!isHalf){
        if(y!=lastClicked && crd[y]==crd[lastClicked]){
          setTimeout(function(){ 
            front.src = 'Images/black.jpg';
            back.src = 'Images/black.jpg';
            cards[y].removeEventListener('dblclick',flip);
            front = cards[lastClicked].querySelector('.front');
            back =  cards[lastClicked].querySelector('.back');
            front.src = 'Images/black.jpg';
            back.src = 'Images/black.jpg';
            cards[lastClicked].removeEventListener('dblclick',flip);
            lastClicked = -1;
            score++;
          },200);  
        }
        else {
          setTimeout(function() {
            front.style.display = 'none';
            back.style.display = 'block';
            front = cards[lastClicked].querySelector('.front');
            back =  cards[lastClicked].querySelector('.back');
            console.log(lastClicked,front,back);
            front.style.display = 'none';
            back.style.display = 'block';
            lastClicked = -1;
          },200);  
        }
      }
      else{
        lastClicked = y;
      }
    }
    else{
      front.style.display = 'none';
      back.style.display = 'block';  
    }
    if(score==8)
      gameOver = true;
    isClicked[y] = !isClicked[y];

}

function reduceTime(){
    let secs = curTime.getSeconds();
    let mins = curTime.getMinutes();
    if(mins==0 && (secs-1) == -1){
        gameOver = true;
        isStartButtonClicked = false;
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


let x;
function startGame(){
    if(isStartButtonClicked===true)
      return;
    isStartButtonClicked = true;
    gameOver = false;
    curTime.setMinutes(1);
    curTime.setSeconds(5);
    timeDis.innerHTML = '0'+curTime.getMinutes()+':'+'0'+curTime.getSeconds();
    cards.forEach(card => card.addEventListener('dblclick',flip)); 
    setInterval(reduceTime,1000);         
}
cards.forEach(card => {
    let front = card.querySelector('.front');
    front.src = `Images/${cpics[crd[cards.indexOf(card)]]}`;
});
startButton.addEventListener('click',startGame);
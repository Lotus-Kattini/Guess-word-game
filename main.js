

//setting game name
let gameName="Guess the word";
const myName='LOTUS'


document.title=gameName;
document.querySelector('h1').innerHTML=gameName;
document.querySelector('footer').innerHTML=`${gameName} Game Created by ${myName} `;


//setting game
let numberofTries=6;
let numberofLetters=6;
let cuurentTry=1;
let hints=2

const hintbtn=document.querySelector('.hint')

//Manage words
let wordToGuess='';
const words=['Python','Kotlin','Elixir','Erlang','Pascal','Groovy','Prolog','Erlang','Racket','Nimrod']
//to choose a random word
wordToGuess=words[Math.floor(Math.random()* words.length)].toLowerCase();
console.log(wordToGuess)

function initGame(){
    let inputsContainer=document.querySelector('.inputs');
    //create main try div
    for(let i=1;i<=numberofTries;i++){
        const tryDiv=document.createElement('div');
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML=`<span>Try ${i}</span>`
        if(i !==1 ){
            tryDiv.classList.add('disabled-input')
        }

        //create inputs
        for(let j=1;j<=numberofLetters;j++){
            const input=document.createElement('input');
            input.type="text";
            input.id=`guess-${i}-letter-${j}`;
            input.setAttribute('maxlength','1')
            tryDiv.appendChild(input)
        }

        inputsContainer.appendChild(tryDiv)
    }
    //focus on the first input
    inputsContainer.children[0].children[1].focus();

    //disabled inputs except the first one
    const inputsInDisabledDiv=document.querySelectorAll(".disabled-input input");
    inputsInDisabledDiv.forEach((input)=>(input.disabled=true))

    //convert letters to uppercase
    const inputs=document.querySelectorAll('input');
    inputs.forEach((input,index)=>{
        input.addEventListener("input",function(){
            this.value=this.value.toUpperCase()

            const nextInput=inputs[index+1];
            if(nextInput) nextInput.focus();
        });

        //make the focus deppending on the arrows clicks
        input.addEventListener("keydown",function(event){
            if(event.key==='ArrowRight'){
                const nextInput=inputs[index+1];
                if(nextInput) nextInput.focus();
            }
            else if(event.key==='ArrowLeft'){
                const prevInput=inputs[index-1];
                if(prevInput) prevInput.focus();
            }
            
            
        })


    })


}


const guessBtn=document.querySelector(".check");
guessBtn.addEventListener("click",handelGuesses)

function handelGuesses(){
    let sucssesGuess=true;
    console.log(wordToGuess)
    for (let i = 1; i <= numberofLetters; i++) {
        let inputField=document.querySelector(`#guess-${cuurentTry}-letter-${i}`);
        let letter=inputField.value.toLowerCase();
        
        const actualLetter=wordToGuess[i-1];
        console.log(actualLetter)

        //Game logic
        if(letter === actualLetter){
            inputField.classList.add('yes-in-place')
        }
        else if(wordToGuess.includes(letter) && letter!==""){
            inputField.classList.add('not-in-place')
            sucssesGuess=false
        }
        else{
            inputField.classList.add('no')
            sucssesGuess=false
        }
        
        
    }
    //check if user win or lose
    const reloadbtn=document.querySelector('.reload')
    if(sucssesGuess){
        let allTries=document.querySelectorAll('.inputs > div')
        allTries.forEach((tryDiv)=>tryDiv.classList.add('disabled-input'))
        guessBtn.disabled=true;

        Swal.fire({
            title: "Good job!",
            text: "You Win!!",
            icon: "success"
        });

        reloadbtn.style.display="flex"
        reloadbtn.addEventListener('click',()=>location.reload())
        hintbtn.disabled=true;
    }
    else{
        document.querySelector(`.try-${cuurentTry}`).classList.add('disabled-input');
        const currentTryInputs=document.querySelectorAll(`.try-${cuurentTry} input`)
        currentTryInputs.forEach((input)=>{
            input.disabled=true;
        })

        cuurentTry++;

        if(cuurentTry<=6){
            document.querySelector(`.try-${cuurentTry}`).classList.remove('disabled-input')
            const nextTryInputs=document.querySelectorAll(`.try-${cuurentTry} input`)
            nextTryInputs.forEach((input)=>(input.disabled=false))
            nextTryInputs[0].focus();
        }
        else if(cuurentTry>6){
            Swal.fire({
                title: "oops",
                text: " you lost..Try again!",
                icon: "error"
            });
        guessBtn.disabled=true;
        hintbtn.disabled=true;

            reloadbtn.style.display="flex"
        reloadbtn.addEventListener('click',()=>location.reload())
        }
    }

}

//manage hints
const hintNum=document.querySelector('.hintNum');
hintNum.innerHTML=hints;

hintbtn.addEventListener('click',handelHints)

function handelHints(){
    if(hints>0){
        hints--;
        hintNum.innerHTML=hints;

        // wordToGuess=words[Math.floor(Math.random()* words.length)].toLowerCase();
        const hint=wordToGuess[Math.floor(Math.random()* wordToGuess.length)].toLowerCase();
        console.log(hint)

        const enabledInputs=document.querySelectorAll('input:not([disabled])');
        const emptyEnabledInputs=Array.from(enabledInputs).filter((input)=>input.value ==='')
        if(emptyEnabledInputs.length > 0 ){
            const randomIndex=Math.floor(Math.random()* emptyEnabledInputs.length);
            let indexToFill=Array.from(wordToGuess[randomIndex])
            console.log(randomIndex)
            console.log(indexToFill)
            enabledInputs[randomIndex].value=indexToFill[0].toUpperCase();
            enabledInputs[randomIndex+1].focus();
            enabledInputs[randomIndex].classList.add('yes-in-place');
            enabledInputs[randomIndex].disabled=true;
            


        }
        
    }
    if(hints===0){
        hintbtn.disabled=true
    }

}

function handelBackspace(event){
    if(event.key==='Backspace'){
        const inputs=document.querySelectorAll('input:not([disabled])');
        let currentIndex=Array.from(inputs).indexOf(document.activeElement)
        if(currentIndex > 0){
            const currentInput=inputs[currentIndex]
            const prevInput=inputs[currentIndex-1]
            console.log(currentInput)
            console.log(prevInput)
            currentInput.value='';
            prevInput.value='';
            prevInput.focus()
        }

    }
    

}

document.addEventListener('keydown',handelBackspace)



window.onload=function(){
    initGame()
}
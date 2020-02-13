const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

// remember the StateMachine lecture
// https://bootcamp.burlingtoncodeacademy.com/lessons/cs/state-machines
let states = {
  'roomOne': { canChangeTo: [ 'roomTwo' ] },
  'roomTwo': { canChangeTo: [ 'roomThree' ] },
  'roomThree': { canChangeTo: [ 'roomOne' ] }
};

let currentState = "green";


//list of valid string inputs



//list of functions
function checkStatus(){

}

function enterState(newState) {
  let validTransitions = states[currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentState = newState;
  } else {
    throw 'Invalid state transition attempted - from ' + currentState + ' to ' + newState;
  }
}



//list of classes
class Room {
    constructor(north, east, south, west, roomInventory, lock){
        this.north = north;
        this.east = east;
        this.south = south;
        this.west = west;
        this.roomInventory = roomInventory;
        this.lock = false;
        this.move = function(room){
            currentRoom = room
        }
    }
}


//list of rooms
let startRoom = new Room (null, null, /*entry to nextroom */ null,  )


//list of objects (if need)
let player = {
    playerInventory : null,
    currentRoom : null,

}

//Player Information


start ()

async function start(){
    
console.log("You realize you are in a dark, dingy and smelly room.  You don't know how you got here, and frankly don't even remember your name!  You are facing a door with a sign on it, as well as multiple items on the other walls. What should you do?")

let answer = ""
answer = await ask('>_ ')
let entryAnswer = ["read sign", "read", "look"]
  while(answer !== 'exit') {
    
    if (entryAnswer.includes(answer)){
     console.log("You selected " + answer + ". You walk over to the sign and read it. It states 'There is only 1 safe way out - if you choose poorly, you will meet your demise. Read carefully and choose wisely to get out of here....Alive!'")
      console.log('this works')
      process.exit()
    }
    else{//need to enter in a loop to get back to the original prompt
      console.log("Sorry I don't recognize that prompt.Try again")
      process.exit()
    }

  }




  
//if user hits exit at any point
  console.log("Come on, don't be scared, figure out how to get out of the room!")
  process.exit()
}
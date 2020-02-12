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
    
console.log("You realize you are in a dark, dingy and smelly room.  You don't know how you got here, \nand frankly don't even remember your name!  You are facing a door with a sign on it, as well as multiple items on the other walls. What should you do?")

let answer = ""
while(answer !== 'exit') {
    answer = await ask('>_ ')
  }

}
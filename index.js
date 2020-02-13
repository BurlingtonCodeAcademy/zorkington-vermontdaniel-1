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


//list of valid string inputs---------------------------------------
const entryAnswer = ["read sign", "read", "look"]


//list of functions-------------------------------------------------
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

function sanitizeString(string) {
  string = string
    .toString()
    .trim()
    .toLowerCase();

  return string;
}


//list of classes---------------------------------------------------
class Room {
    constructor(north, east, south, west, roomInventory, lock){
        this.north = north;
        this.east = east;
        this.south = south;
        this.west = west;
        this.roomInventory = roomInventory || [];
        this.lock = false;
        this.move = function(room){
            currentRoom = room
        }
    }
}


//list of rooms-----------------------------------------------------

//connects: centerRoom(south), has three items and is locked.
let startRoom = new Room (null, null, /*centerRoom,*/ null, ['statue', 'north painting', 'sign by door'], true )

//connects to 4 rooms, no items, is unlocked
let centerRoom = new Room (/*startRoom, hallwayRoom, itemRoom, trapRoom,*/ [])

//connects: centerRoom(west) and finalRoom(south), has puzzle, is locked, needs key(itemRoom) to unlock
let hallwayRoom = new Room (null, null, /*finalRoom, centerRoom*, [inventory: needs interactive puzzle*/ true )

//needs better name, connects: centerRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let itemRoom = new Room (/*centerRoom,*/ null, null,  null, ['hallwayRoom key', 'trapRoom key', 'puzzle 1', 'puzzle 2', 'puzzle 3'] )

//connects: centerRoom(east), no items, needs key(itemRoom) to unlock, if entered should console.log losing method && change status
let trapRoom = new Room (null, /*centerRoom,*/ null, null, [], true)

//connects: hallwayRoom(north), no items, hallwayRoom puzzle unlocks, if entered console.log victory message
let finalRoom = new Room (/*hallwayRoom,*/ null, null, null, [], true)

//list of objects --------------------------------------------------
let playerStatus = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared',
}



//Player Information------------------------------------------------
let player = {
    playerInventory : null,
    currentRoom : null,
    currentStatus: null
}


start ()

async function start(){
//Start up message
console.log("You realize you are in a dark, dingy and smelly room.  You don't know how you got here, and frankly don't even remember your name!  You are facing a door with a sign on it, as well as multiple items on the other walls. What should you do?")

// Game setup
let answer = "";
player.currentRoom = startRoom;
player.currentStatus = playerStatus.scared;


  while(answer !== 'exit') {
    answer = await ask('>_ ')

    if (entryAnswer.includes(sanatizeString(answer))){
     console.log("You selected " + answer + ". You walk over to the sign and read it. It states 'There is only 1 safe way out - if you choose poorly, you will meet your demise. Read carefully and choose wisely to get out of here....Alive!'")
      console.log('this works')
      
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
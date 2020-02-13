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
  'roomOne': { canChangeTo: ['roomTwo'] },
  'roomTwo': { canChangeTo: ['roomThree'] },
  'roomThree': { canChangeTo: ['roomOne'] }
};

let currentState = "green";


//list of valid string inputs---------------------------------------
const entryAnswer = ["read sign", "read", "look"]


//list of functions-------------------------------------------------
function checkStatus() {

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
  constructor(roomName, description, north, east, south, west, roomInventory, lock) {
    this.roomName = roomName;
    this.description = description;
    this.north = north;
    this.east = east;
    this.south = south;
    this.west = west;
    this.roomInventory = roomInventory || [];
    this.lock = lock;
    //Functions
    this.move = function (room) {
      currentRoom = room
    }
    this.take = function (room) {

    }
    this.drop = function (room) {

    }
    this.checkInventory = function (room) {

    }
    
  }
}

// List of Tables --------------------------------------------------
const roomTable = {
  startRoom : 'startRoom',
  centerRoom : 'centerRoom',
  hallwayRoom : 'hallwayRoom',
  itemRoom : 'itemRoom',
  trapRoom : 'trapRoom',
  finalRoom : 'finalRoom'
}

const mutableItemTable = {
 signByDoor : 'signByDoor',
 hallwayRoomKey : 'hallwayRoomKey',
 trapRoomKey : 'trapRoomKey',
 puzzle1 : 'puzzle1',
 puzzle2 : 'puzzle2',
 puzzle3 : 'puzzle3',
 lantern : 'lantern'
}

const unmutableItemTable = {
  statue : 'statue',
  northPainting : 'northPainting',

}

//list of rooms-----------------------------------------------------

//connects: centerRoom(south), has three items and is locked.
let startRoom = new Room (null, null, 'centerRoom', null, ['statue', 'northPainting', 'signByDoor'], true )

//connects to 4 rooms, no items, is unlocked
let centerRoom = new Room ('startRoom', 'hallwayRoom', 'itemRoom', 'trapRoom', [], false)

//connects: centerRoom(west) and finalRoom(south), has puzzle, is locked, needs key(itemRoom) to unlock
let hallwayRoom = new Room (null, null, 'finalRoom', 'centerRoom', ['lantern'], true )

//needs better name, connects: centerRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let itemRoom = new Room ('centerRoom', null, null,  null, ['hallwayRoomKey', 'trapRoomKey', 'puzzle1', 'puzzle2', 'puzzle3'], false )

//connects: centerRoom(east), no items, needs key(itemRoom) to unlock, if entered should console.log losing message && change status to dead
let trapRoom = new Room (null, 'centerRoom', null, null, [], true)

//connects: hallwayRoom(north), no items, hallwayRoom puzzle unlocks, if entered console.log victory message, change status to relief
let finalRoom = new Room ('hallwayRoom', null, null, null, [], true)

//list of objects --------------------------------------------------
let playerEmotionalStatus = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared',
}



//Player Information------------------------------------------------
let player = {
  playerInventory: [],
  currentRoom: null,
  currentStatus: null
}

start()

async function start() {
  //Start up message
  console.log("You realize you are in a dark, dingy and smelly room. \nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing a door with a sign on it, as well as multiple items on the other walls. \nWhat should you do?")

  // Game setup
  let answer = "";
  player.currentRoom = startRoom;
  player.currentStatus = playerEmotionalStatus.scared;

  while (answer !== 'exit') {
    answer = await ask('>_ ')

    if (entryAnswer.includes(sanitizeString(answer))) {
      console.log(`You selected ${answer}. You walk over to the sign and read it. It states 'There is only 1 safe way out - if you choose poorly, you will meet your demise. Read carefully and choose wisely to get out of here....Alive!`)


    }
    else {
      console.log(`Sorry I don't recognize the prompt: ${answer}. Try again`)
    }

  }





  //if user hits exit at any point
  console.log("Come on, don't be scared, figure out how to get out of the room!")
  process.exit()
}
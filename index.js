const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/********************************************************************/
let answer = "";

// List of LookupTables --------------------------------------------------
const roomTable = {
  startRoom: 'startRoom',
  centerRoom: 'centerRoom',
  hallwayRoom: 'hallwayRoom',
  itemRoom: 'itemRoom',
  trapRoom: 'trapRoom',
  finalRoom: 'finalRoom'
}

const mutableItemTable = {
  signByDoor: 'signByDoor',
  hallwayRoomKey: 'hallwayRoomKey',
  trapRoomKey: 'trapRoomKey',
  puzzle1: 'puzzle1',
  puzzle2: 'puzzle2',
  puzzle3: 'puzzle3',
  lantern: 'lantern'
}

const unmutableItemTable = {
  statue: 'statue',
  northPainting: 'northPainting',

}

let emotionalLookup = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared'
}


// State Machines ---------------------------------------------------

// Room Transition State Machine
let roomStates = {
  'startRoom': { canChangeTo: ['centerRoom'] },
  'centerRoom': { canChangeTo: ['startRoom', 'hallwayRoom', 'itemRoom', 'trapRoom'] },
  'hallwayRoom': { canChangeTo: ['centerRoom', 'finalRoom'] },
  'itemRoom': { canChangeTo: ['centerRoom'] },
  'trapRoom': { canChangeTo: ['centerRoom'] },
};

let currentRoomState = "startRoom";

//Emotion Status State Machine
let playerEmotionalState = {
  "dead": { canChangeTo: ["dead"] },
  "relief": { canChangeTo: ["scared", "dead"] },
  "scared": { canChangeTo: ["relief", "dead"] }
}
let currentEmotionalState = 'scared'

//list of functions-------------------------------------------------
function checkStatus() {
}

function enterRoomState(newRoomState) {
  let validTransitions = roomStates[currentRoomState].canChangeTo;

  if (validTransitions.includes(newRoomState)) {
    console.log(`Moving from ${currentRoomState} to ${newRoomState}`)
    currentRoomState = newRoomState;
    console.log(`You are now in ${currentRoomState}`)
    return;

  } else {
    console.log(`Invalid pathway - from ${currentRoomState} to ${newRoomState}`);
  }
}

function sanitizeString(string) {
  string = string
    .toString()
    .trim()
    .toLowerCase();

  return string;
}

function userInputNotValidCheck() {
  for (let array in validActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}

function userInputNotInValidCheck() {
  for (let array in invalidActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}


let currentEmot = emotionalLookup[currentEmotionalState]
function changeEmotion(change) {
  if (playerEmotionalState[currentEmotionalState].canChangeTo.includes(change)) {
    console.log("Changing from state: " + currentEmotionalState)
    currentEmotionalState = change
    currentEmot = emotionalLookup[currentEmotionalState]
    console.log('Current emotional state is: ' + currentEmotionalState)

  } else {
    console.log('invalid emotional transition attempted')
    console.log('Current emotional state is: ' + currentEmotionalState)
  }
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
      if(this.lock === true){
        console.log('The door is locked. Our bad.')
      }
      // else if(enterRoomState(room)){
      //     return }
      // else { 
      //   player.currentRoom = room;
      //   console.log('The door is unlocked, please come in')
      // }
    }
    this.take = function (room) {

    }
    this.drop = function (room) {

    }
    this.checkInventory = function (room) {

    }
    this.examineRoom = function (room) {

    }

  }
}




//list of rooms-----------------------------------------------------

//connects: centerRoom(south), has three items and is locked.
let startRoom = new Room('startRoom', 'dark, dingy, smelly room', null, null, null, 'centerRoom', null, ['statue', 'northPainting', 'signByDoor'], false)

//connects to 4 rooms, no items, is unlocked
let centerRoom = new Room('centerRoom', '', null, 'startRoom', 'hallwayRoom', 'itemRoom', 'trapRoom', [], false)

//connects: centerRoom(west) and finalRoom(south), has puzzle, is locked, needs key(itemRoom) to unlock
let hallwayRoom = new Room('hallwayRoom', '', null, null, null, 'finalRoom', 'centerRoom', ['lantern'], true)

//needs better name, connects: centerRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let itemRoom = new Room('itemRoom', '', null, 'centerRoom', null, null, null, ['hallwayRoomKey', 'trapRoomKey', 'puzzle1', 'puzzle2', 'puzzle3'], false)

//connects: centerRoom(east), no items, needs key(itemRoom) to unlock, if entered should console.log losing message && change status to dead
let trapRoom = new Room('trapRoom', '', null, null, 'centerRoom', null, null, [], true)

//connects: hallwayRoom(north), no items, hallwayRoom puzzle unlocks, if entered console.log victory message, change status to relief
let finalRoom = new Room('finalRoom', '', null, 'hallwayRoom', null, null, null, [], true)


//list of objects --------------------------------------------------
let playerEmotionalStatus = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared',
}

const validActions = {
  signByDoor: ['read sign', 'read the sign', 'look at the sign', 'examine the sign', 'examine sign', 'sign'],
  statue: ['look at statue', 'examine statue', 'look at the statue', 'examine the statue', 'statue'],
  northPainting: ['look at painting', 'examine painting', 'look at the painting', 'examine the painting', 'painting'],
  hallwayRoomKey: [],
  trapRoomKey: [],
  puzzle1: [],
  puzzle2: [],
  puzzle3: [],
  lantern: []
}

const validRoomActions = {
  door: ['open door', 'access door', 'enter door']
}

const invalidRoomActions = {
  door: ['kick door', 'break door', 'burn down door', 'burn door', 'barge down door', 'barge down the door']
}

const invalidActions = {
  statue: ['take the statue', 'take statue', 'move the statue', 'move statue', 'break', 'break statue'],
  northPainting: ['take the painting', 'take painting', 'move the painting', 'move painting',],
}

const itemDescrip = {
  puzzle1: "",
  puzzle2: "",
  puzzle3: "",
  lantern: "",
  hallwayRoomKey: "",
  trapRoomKey: "",
  signByDoor: "There is only 1 safe way out - if you choose poorly, you will meet your demise. \nRead carefully and choose wisely to get out of here....Alive!\n",
  statue: "partially destroyed marble statue of an angel. \nIt's nose is missing and only one finger is left of its right hand",
  northPainting: "It's a beautiful yet gothic oil painting of 3 cats playing poker"


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
  console.log(`\nYou realize you are in a ${startRoom.description}. \nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing a door with a sign on it, as well as multiple items on the other walls. \nWhat should you do?`)

  // Game setup
  player.currentRoom = startRoom;
  player.currentStatus = playerEmotionalStatus.scared;
  answer = await ask('>_ ')

  while (answer !== 'exit') {



    // Interacting with the sign
    if (validActions.signByDoor.includes(sanitizeString(answer))) {
      console.log(`You prompted: ${answer}. \n\nYou walk over to the sign and read it. It states: ${itemDescrip.signByDoor}\n`)
      answer = await ask('>_ ');
    }
    //process to start room door
    if (validRoomActions.door.includes(sanitizeString(answer))){
      startRoom.move('centerRoom')
      
    }
    // Interacting with the Statue
    if (validActions.statue.includes(sanitizeString(answer))) {
      console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.statue}`)
      answer = await ask('>_ ');
    }
    else if (invalidActions.statue.includes(sanitizeString(answer))) {
      console.log(`Who do you think you are?!  You are not strong enough! Check yo self!`)
      answer = await ask('>_ ');
    }

    // Checks for invalid user input
    if (userInputNotValidCheck(answer) && userInputNotInValidCheck(answer)) {
      console.log(`I dont recognize the input ${answer}.`)
      answer = await ask('>_ ');
    }


  }






  //if user hits exit at any point
  //console.log("Come on, don't be scared, figure out how to get out of the room!")
  // process.exit()
}
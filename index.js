const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/*******************************************************************************************************************************************************/

let answer = '';

// State Machines ---------------------------------------------------------------------------------------------------------------------------------------

// Room Transition State Machine
let roomStates = {
  startRoom: { canChangeTo: ['centerRoom'] },
  centerRoom: { canChangeTo: ['startRoom', 'hallwayRoom', 'itemRoom', 'trapRoom'] },
  hallwayRoom: { canChangeTo: ['centerRoom', 'finalRoom'] },
  itemRoom: { canChangeTo: ['centerRoom'] },
  trapRoom: { canChangeTo: ['centerRoom'] },
};
let currentRoomState = 'startRoom';

//Emotion Status State Machine
let playerEmotionalState = {
  dead: { canChangeTo: ['dead'] },
  relief: { canChangeTo: ['scared', 'dead'] },
  scared: { canChangeTo: ['relief', 'dead'] },
};
let currentEmotionalState = 'scared';

//list of functions--------------------------------------------------------------------------------------------------------------------------------------

//checks for ANY valid and invalid input
function validUserInput() {
  if (userItemInputNotValidCheck() && userItemInputNotInValidCheck() && userRoomInputNotValidCheck() && userRoomInputNotInValidCheck()) {
    return true;
  }
}

//filler, will check user emotional status
function checkStatus() {}

//Moves from one room to another
function enterRoomState(newRoomState) {
  let validTransitions = roomStates[currentRoomState].canChangeTo;

  if (validTransitions.includes(newRoomState)) {
    console.log(`Moving from ${currentRoomState} to ${newRoomState}`);
    currentRoomState = newRoomState;
    console.log(`You are now in ${currentRoomState}`);
    player.currentRoom = currentRoomState;
    return;
  } else {
    console.log(`Invalid pathway - from ${currentRoomState} to ${newRoomState}`);
  }
}

//Sanitizes user input to valid format
function sanitizeString(string) {
  string = string
    .toString()
    .trim()
    .toLowerCase();

  return string;
}

// Checks if user input can be used on items
function userItemInputNotValidCheck() {
  for (let array in validItemActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}

//checks if user input cannot be used on items
function userItemInputNotInValidCheck() {
  for (let array in invalidItemActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}

//checks if user input can be used on rooms
function userRoomInputNotValidCheck() {
  for (let array in validRoomActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}

//checks if user input cannot be used on rooms
function userRoomInputNotInValidCheck() {
  for (let array in invalidRoomActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}

//Changes player emotional state
function changeEmotion(change) {
  if (playerEmotionalState[currentEmotionalState].canChangeTo.includes(change)) {
    console.log('Changing from state: ' + currentEmotionalState);
    currentEmotionalState = change;
    currentEmot = emotionalLookup[currentEmotionalState];
    console.log('Current emotional state is: ' + currentEmotionalState);
  } else {
    console.log('invalid emotional transition attempted');
    console.log('Current emotional state is: ' + currentEmotionalState);
  }
}

//list of classes----------------------------------------------------------------------------------------------------------------------------------------

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
    //this.move = function (room) {
    //  if(this.lock !== true){
    //    console.log('The door is locked. Our bad. Try using a 4 digit code - hint - it may be the best day of the year.  My favorite kind is cherry')
    //  }
    //  //issues are below
    //  else if(enterRoomState(room)){
    //       return }
    //   else {
    //     player.currentRoom = room;
    //     console.log('The door is unlocked, please come in')
    //   }
    // }
    this.take = function(room) {};
    this.drop = function(room) {};
    this.checkInventory = function(room) {};
    this.examineRoom = function(room) {};
  }
}

//list of rooms------------------------------------------------------------------------------------------------------------------------------------------

//connects: centerRoom(south), has three items and is locked.
let startRoom = new Room('startRoom', 'dark, dingy, smelly room', null, null, null, 'centerRoom', null, ['statue', 'northPainting', 'signByDoor'], true);

//connects to 4 rooms, no items, is unlocked
let centerRoom = new Room('centerRoom', '', null, 'startRoom', 'hallwayRoom', 'itemRoom', 'trapRoom', [], false);

//connects: centerRoom(west) and finalRoom(south), has puzzle, is locked, needs key(itemRoom) to unlock
let hallwayRoom = new Room('hallwayRoom', '', null, null, null, 'finalRoom', 'centerRoom', ['lantern'], true);

//needs better name, connects: centerRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let itemRoom = new Room('itemRoom', '', null, 'centerRoom', null, null, null, ['hallwayRoomKey', 'trapRoomKey', 'puzzle1', 'puzzle2', 'puzzle3'], false);

//connects: centerRoom(east), no items, needs key(itemRoom) to unlock, if entered should console.log losing message && change status to dead
let trapRoom = new Room('trapRoom', '', null, null, 'centerRoom', null, null, [], true);

//connects: hallwayRoom(north), no items, hallwayRoom puzzle unlocks, if entered console.log victory message, change status to relief
let finalRoom = new Room('finalRoom', '', null, 'hallwayRoom', null, null, null, [], true);

//list of objects ---------------------------------------------------------------------------------------------------------------------------------------
const playerEmotionalStatus = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared',
};

const validItemActions = {
  signByDoor: ['read sign', 'read the sign', 'look at the sign', 'examine the sign', 'examine sign', 'sign'],
  statue: ['look at statue', 'examine statue', 'look at the statue', 'examine the statue', 'statue'],
  northPainting: ['look at painting', 'examine painting', 'look at the painting', 'examine the painting', 'painting'],
  hallwayRoomKey: [],
  trapRoomKey: [],
  puzzle1: [],
  puzzle2: [],
  puzzle3: [],
  lantern: [],
};

const validPlayerActions = {
  checkInventory: ['i', 'inventory', 'check inventory', 'inv'],
};

const invalidItemActions = {
  statue: ['take the statue', 'take statue', 'move the statue', 'move statue', 'break', 'break statue'],
  northPainting: ['take the painting', 'take painting', 'move the painting', 'move painting'],
};

const validRoomActions = {
  door: ['open door', 'access door', 'enter door', 'unlock door', 'enter code', 'put in code', 'code'],
};

const invalidRoomActions = {
  door: ['kick door', 'break door', 'burn down door', 'burn door', 'barge down door', 'barge down the door'],
};

const startGameInput = {
  yes: ['yes', 'yeah', 'y', 'yes ready'],
  no: ['no', 'n', 'not ready'],
};

const itemDescrip = {
  puzzle1: '',
  puzzle2: '',
  puzzle3: '',
  lantern: '',
  hallwayRoomKey: '',
  trapRoomKey: '',
  signByDoor: 'There is only 1 safe way out - if you choose poorly, you will meet your demise. \nRead carefully and choose wisely to get out of here....Alive!\n',
  statue: "partially destroyed marble statue of an angel. \nIt's nose is missing and only one finger is left of its right hand",
  northPainting: "It's a beautiful yet gothic oil painting of 3 cats playing poker",
};

// List of LookupTables ---------------------------------------------------------------------------------------------------------------------------------

const roomTable = {
  startRoom: startRoom,
  centerRoom: centerRoom,
  hallwayRoom: hallwayRoom,
  itemRoom: itemRoom,
  trapRoom: trapRoom,
  finalRoom: finalRoom,
};

//const mutableItemTable = {
//  'signByDoor': signByDoor,
//  'hallwayRoomKey': hallwayRoomKey,
//  'trapRoomKey': trapRoomKey,
//  'puzzle1': puzzle1,
//  'puzzle2': puzzle2,
//  'puzzle3': puzzle3,
//  'lantern': lantern
//}

//const unmutableItemTable = {
//  'statue': statue,
//  'northPainting': northPainting
//
//}

//let emotionalLookup = {
//  'dead': dead,
//  'relief': relief,
//  'scared': scared
//}

//Player Information-------------------------------------------------------------------------------------------------------------------------------------

let player = {
  playerInventory: [],
  currentRoom: null,
  currentStatus: null,
};
//let currentEmot = emotionalLookup[currentEmotionalState]
// Game Function ----------------------------------------------------------------------------------------------------------------------------------------
startGame();

async function startGame() {
  //Start up message
  console.log(`\nWelcome to our awesome game! are you ready to live? Yes? or maybe no?`);
  answer = '';

  // Checks input, if yes starts the game logic function
  while (!startGameInput.yes.includes(sanitizeString(answer))) {
    answer = await ask('>_ ');

    if (startGameInput.no.includes(sanitizeString(answer))) {
      console.log('Maybe next time?');
      process.exit();
    } else if (!startGameInput.no.includes(answer) && !startGameInput.yes.includes(answer)) {
      console.log(`No idea what you\'re trying to do with the prompt: ${answer}.`);
    }
  }
  // Start of playable game
  console.log(
    `\nYou realize you are in a ${startRoom.description}. \nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing a door with a sign on it, as well as multiple items on the other walls. \nWhat should you do?`
  );
  play();
  player.currentRoom = 'startRoom';
  player.currentStatus = playerEmotionalStatus.scared;
  return;
}

async function play() {
  answer = await ask('>_ ');

  // Checks for invalid user input
  if (validUserInput(answer)) {
    console.log('wrong');
    play();
  }

  // Interacting with the sign
  if (validItemActions.signByDoor.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou walk over to the sign and read it. It states: ${itemDescrip.signByDoor}\n`);
    play();
  }

  //process to start room door
  if (validRoomActions.door.includes(sanitizeString(answer))) {
    if (player.currentRoom.lock === true) {
      console.log('The door is locked. Our bad. Try using a 4 digit code - hint - it may be the best day of the year.  My favorite kind is cherry');
      play();
    }

    //enter a code to get access to the room
    if (answer === '0314') {
      enterRoomState('centerRoom');
      console.log('Success!  You got in!');
      play();
    }
  }

  //checking inventory
  if (validPlayerActions.checkInventory.includes(answer)) {
    console.log(`Your prompted: ${answer}. \n You have: ${player.playerInventory}`);
    if (player.playerInventory === []) {
      console.log(`You have nothing in your arms.`);
    }
    play();
  }

  // Interacting with the Statue
  if (validItemActions.statue.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.statue}`);
    play();
  } else if (invalidItemActions.statue.includes(sanitizeString(answer))) {
    console.log(`Who do you think you are?!  You are not strong enough! Check yo self!`);
    play();
  }
}

// //if user hits exit at any point
// console.log("Come on, don't be scared, figure out how to get out of the room!")
// process.exit()

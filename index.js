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
  centerRoom: { canChangeTo: ['startRoom', 'pinkRoom', 'redRoom', 'blueRoom'] },
  pinkRoom: { canChangeTo: ['centerRoom', 'finalRoom'] },
  redRoom: { canChangeTo: ['centerRoom'] },
  blueRoom: { canChangeTo: ['centerRoom'] },
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
function userInputValidCheck() {
  for (let array in validActions) {
    if (array.includes(answer)) {
      return false;
    } else {
      return true;
    }
  }
}

//checks if user input cannot be used on items
function userInputInvalidCheck() {
  for (let array in invalidActions) {
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

//list of objects ---------------------------------------------------------------------------------------------------------------------------------------
const playerEmotionalStatus = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared',
};

const validActions = {
  signByDoor: ['read sign', 'read the sign', 'look at the sign', 'examine the sign', 'examine sign', 'sign', 'take sign', 'pi'],
  statue: ['look at statue', 'examine statue', 'look at the statue', 'examine the statue', 'statue'],
  northPainting: ['look at painting', 'examine painting', 'look at the painting', 'examine the painting', 'painting'],
  pinkRoomKey: [],
  blueRoomKey: [],
  puzzle1: [],
  puzzle2: [],
  puzzle3: [],
  lantern: [],
  door: ['open door', 'access door', 'enter door', 'unlock door', 'enter code', 'put in code', 'code'],
  checkInventory: ['i', 'inventory', 'check inventory', 'inv'],
  yes: ['yes', 'yeah', 'y', 'yes ready'],
  no: ['no', 'n', 'not ready'],
  prompt: ['>_ '],
  keyCodeAction: ['enter code', 'code in', 'key', 'key in', 'code', 'key code', 'code key'],
  keyCode: ['0314'],
  lookAround : ['look around', 'look around room', 'examine the room', 'examine room']
};

const invalidActions = {
  statue: ['take the statue', 'take statue', 'move the statue', 'move statue', 'break', 'break statue'],
  northPainting: ['take the painting', 'take painting', 'move the painting', 'move painting'],
  door: ['kick door', 'break door', 'burn down door', 'burn door', 'barge down door', 'barge down the door', 'break down the door', 'kick down the door', 'kick down door', 'break down door'],
};

const itemDescrip = {
  puzzle1: '',
  puzzle2: '',
  puzzle3: '',
  lantern: '',
  pinkRoomKey: '',
  blueRoomKey: '',
  signByDoor: 'There is only 1 safe way out - if you choose poorly, you will meet your demise. \nRead carefully and choose wisely to get out of here....Alive!\nDate: Pie Day',
  statue: "partially destroyed marble statue of an angel. \nIt's nose is missing and only one finger is left of its right hand",
  northPainting: "beautiful yet gothic oil painting of 3 cats playing poker",
  
};


//list of rooms------------------------------------------------------------------------------------------------------------------------------------------

//connects: centerRoom(south), has three items and is locked.
let startRoom = new Room('startRoom', `dark, dingy, smelly room. On the west wall is a ${itemDescrip.statue}. \nOn the North wall is a ${itemDescrip.northPainting} `, null, null, 'centerRoom', null, ['statue', 'northPainting', 'signByDoor'], true);

//connects to 4 rooms, no items, is unlocked
let centerRoom = new Room('centerRoom', 'You are in a sterile and cold room that have 3 separate doors - each with a different color - baby blue, pepto bismal pink, and blood red.  If you select correctly, you may get out of here alive.  If you select the wrong room....YOU WILL DIE! ', null, 'startRoom', 'pinkRoom', 'redRoom', 'blueRoom', [], false);

//connects: centerRoom(west) and finalRoom(south), has puzzle, is locked, needs key(redRoom) to unlock
let pinkRoom = new Room('pinkRoom', '', null, null, null, 'finalRoom', 'centerRoom', ['lantern'], true);

//needs better name, connects: centerRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let redRoom = new Room('redRoom', '', null, 'centerRoom', null, null, null, ['pinkRoomKey', 'blueRoomKey', 'puzzle1', 'puzzle2', 'puzzle3'], false);

//connects: centerRoom(east), no items, needs key(redRoom) to unlock, if entered should console.log losing message && change status to dead
let blueRoom = new Room('blueRoom', '', null, null, 'centerRoom', null, null, [], true);

//connects: pinkRoom(north), no items, pinkRoom puzzle unlocks, if entered console.log victory message, change status to relief
let finalRoom = new Room('finalRoom', '', null, 'pinkRoom', null, null, null, [], true);


// List of LookupTables ---------------------------------------------------------------------------------------------------------------------------------

const roomTable = {
  startRoom: startRoom,
  centerRoom: centerRoom,
  pinkRoom: pinkRoom,
  redRoom: redRoom,
  blueRoom: blueRoom,
  finalRoom: finalRoom,
};

//const mutableItemTable = {
//  'signByDoor': signByDoor,
//  'pinkRoomKey': pinkRoomKey,
//  'blueRoomKey': blueRoomKey,
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
  while (!validActions.yes.includes(sanitizeString(answer))) {
    answer = await ask(validActions.prompt);

    if (validActions.no.includes(sanitizeString(answer))) {
      console.log('Maybe next time?');
      process.exit();
    } else if (!validActions.no.includes(answer) && !validActions.yes.includes(answer)) {
      console.log(`No idea what you\'re trying to do with the prompt: ${answer}.`);
    }
  }
  // Start of playable game
  console.log(
    `\nYou realize you are in a ${startRoom.description}. \nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing a door with a sign on it.\nWhat should you do?`
  );
  play();
  player.currentRoom = roomTable['startRoom'];
  player.currentStatus = playerEmotionalStatus.scared;
  return;
}

async function play() {
  answer = await ask(validActions.prompt);
//
  //// Checks for invalid user input
  //if (userInputValidCheck(answer) && userInputInvalidCheck(answer) === true) {
  //  console.log('dont recognize that');
  //  play();
  //}
  
  if(validActions.lookAround.includes(sanitizeString(answer))){
    console.log(`You prompted: ${answer}. \n ${currentRoom.description}`)
    play()
  }

  // Interacting with the sign
  if (validActions.signByDoor.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \nYou walk over to the sign and read it. \nIt states: ${itemDescrip.signByDoor}\n`);
    play();
  }

  //interacting with the startRoom door
  if (validActions.door.includes(sanitizeString(answer))) {
    if (player.currentRoom.lock === true) {
      console.log(`You prompted: ${answer}. \nThe door is locked. Our bad. There is a keypad on the handle. \n`);
      play();
    }
    if (invalidActions.door.includes(sanitizeString(answer))) {
      console.log(`You prompted: ${answer}.\nYeah, theres no way you're damaging this door. Ya fool.`);
      play();
    }
  }

  //interacting with keypad
  if (validActions.keyCodeAction.includes(sanitizeString(answer))) {
    console.log('Please type in the code now:');
    play();
  }

  if (validActions.keyCode.includes(sanitizeString(answer))) {
    enterRoomState('centerRoom');
    console.log(`You prompted: ${answer}.\nSuccess! You got in! \n\nYou see a ${centerRoom.description}`);
   
    play();
  }
  
  //checking inventory
  if (validActions.checkInventory.includes(answer)) {
    console.log(`Your prompted: ${answer}. \n You have: ${player.playerInventory}`);
    if (player.playerInventory === []) {
      console.log(`You have nothing in your arms.`);
    }
    play();
  }

  // Interacting with the Statue
  if (validActions.statue.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.statue}`);
    play();
  } else if (invalidActions.statue.includes(sanitizeString(answer))) {
    console.log(`Who do you think you are?!  You are not strong enough! Check yo self!`);
    play();
  }

  //interacting with the painting
  if (validActions.northPainting.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.northPainting}`);
    play();
  } else if (invalidActions.northPainting.includes(sanitizeString(answer))) {
    console.log(`Who do you think you are?!  You can't take that fine piece of art from me! Check yo self!`);
    play();
  }
}

// //if user hits exit at any point
// console.log("Come on, don't be scared, figure out how to get out of the room!")
// process.exit()

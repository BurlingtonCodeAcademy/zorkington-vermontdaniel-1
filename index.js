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
  yellowRoom: { canChangeTo: ['greyRoom'] },
  greyRoom: { canChangeTo: ['yellowRoom', 'pinkRoom', 'redRoom', 'blueRoom'] },
  pinkRoom: { canChangeTo: ['greyRoom', 'finalRoom'] },
  redRoom: { canChangeTo: ['greyRoom'] },
  blueRoom: { canChangeTo: ['greyRoom'] },
};
let currentRoomState = 'yellowRoom';

//Emotion Status State Machine
let playerEmotionalState = {
  dead: { canChangeTo: ['dead'] },
  relief: { canChangeTo: ['scared', 'dead'] },
  scared: { canChangeTo: ['relief', 'dead'] },
};
let currentEmotionalState = 'scared';

//list of functions--------------------------------------------------------------------------------------------------------------------------------------

//Take item from room, move to player inventory

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

//For being able to take item
function takeItem(item) {
  if (validActions.includes(item)) {
    console.log(`You are allowed to take ${item}`);
    playerInventory = item;
    console.log(`Your current inventory is: ` + playerInventory)
  } else {
    console.log(`Nope! Can't take the ${item} with you!`)
    console.log(`Your current inventory is: ` + playerInventory)
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
      return true;
    } else {
      return false;
    }
  }
}
// Checks if user input can be used on items, might need
// function userInputValidCheck() {
//   for (let array in validActions) {
//     if (array.includes(answer)) {
//       return false;
//     } else {
//       return true;
//     }
//   }
// }

//checks if user input cannot be used on items, might need
// function userInputInvalidCheck() {
//   for (let array in invalidActions) {
//     if (array.includes(answer)) {
//       return false;
//     } else {
//       return true;
//     }
//   }
// }

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
    this.take = function (room) { };
    this.drop = function (room) { };
    this.checkInventory = function (room) { };
    this.examineRoom = function (room) { };
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
  pinkRoomKey: ['take key', 'my key now', 'key is mine'],
  blueRoomKey: ['take key', 'i want key', 'taking key'],
  puzzle1: ['pick up first puzzle piece', 'pick up 1 puzzle piece', 'pick up first puzzle', 'grab 1 puzzle piece', 'take puzzle 1'],
  puzzle2: ['pick up second puzzle piece', 'pick up 2 puzzle piece', 'pick up second puzzle', 'grab 2 puzzle piece', 'take puzzle 2'],
  puzzle3: ['pick up third puzzle piece', 'pick up 3 puzzle piece', 'pick up third puzzle', 'grab 3 puzzle piece', 'take puzzle 3'],
  lantern: ['take lantern', 'steal lantern', 'grab lantern', 'my lantern'],
  door: ['open door', 'access door', 'enter door', 'unlock door', 'enter code', 'put in code', 'code'],

  //Valid Player User Input
  checkInventory: ['i', 'inventory', 'check inventory', 'inv'],
  checkEmotionalStatus: ['s', 'check status', 'status', 'check emotional status'],
  yes: ['yes', 'yeah', 'y', 'yes ready'],
  no: ['no', 'n', 'not ready'],
  prompt: ['>_ '],
  lookAround: ['look around', 'look around room', 'examine the room', 'examine room', 'l'],

  // yellowRoom user inputs
  signByDoor: ['read sign', 'read the sign', 'look at the sign', 'examine the sign', 'examine sign', 'sign', 'take sign', 'pi'],
  takeSignByDoor: ['take sign', 'take the sign', 'remove the sign', 'remove sign'],
  statue: ['look at statue', 'examine statue', 'look at the statue', 'examine the statue', 'statue', 'look at statue of angel', 'look at angel statue', 'look at the statue of the angel'],
  northPainting: ['look at painting', 'examine painting', 'look at the painting', 'examine the painting', 'painting'],
  keyCodeAction: ['enter code', 'code in', 'key', 'key in', 'code', 'key code', 'code key'],
  keyCode: ['0314'],

  //Valid Door User Input
  selectPinkDoor: ['open pink door', 'open pink', 'pink door', 'go in pink door', 'enter pink room', 'go in pink'],
  selectRedDoor: ['open red door', 'open red', 'red door', 'go in red door', 'enter red room', 'go in red'],
  selectBlueDoor: ['open blue door', 'open blue', 'blue door', 'go in blue door', 'enter blue room', 'go in blue'],
  selectGreyDoor: ['open grey door', 'open grey', 'grey door', 'go in grey door', 'enter grey room', 'go in grey'],
  selectYellowDoor: ['open yellow door', 'open yellow', 'yellow door', 'go in yellow door', 'enter yellow room', 'go in yellow'],

  //Still organizing these
  pinkRoomKey: [],
  blueRoomKey: [],
  puzzle1: [],
  puzzle2: [],
  puzzle3: [],
  lantern: [],
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
  statue: "partially destroyed marble statue of an angel. \nIt's nose is missing and only one finger is left of its right hand.",
  northPainting: 'beautiful yet gothic oil painting of 3 cats playing poker.',
};

//list of rooms------------------------------------------------------------------------------------------------------------------------------------------

//connects: greyRoom(south), has three items and is locked.
let yellowRoom = new Room(
  'yellowRoom',
  `A dirty yellow, dark, dingy, smelly room. Against one the walls is a ${itemDescrip.statue}. \nOn another wall is a ${itemDescrip.northPainting}. There is a single grey door.\n`,
  null,
  null,
  'greyRoom',
  null,
  ['statue', 'northPainting', 'signByDoor'],
  true
);

//connects to 4 rooms, no items, is unlocked
let greyRoom = new Room(
  'greyRoom',
  'You are in a sterile and cold grey room that has 3 more separate doors - each with a different color - baby blue, pepto bismal pink, and blood red. Looking behind you, you see that the grey door is yellow on this side of it. If you select correctly, you may get out of here alive.  If you select the wrong room....YOU WILL DIE! ',
  null,
  'yellowRoom',
  'pinkRoom',
  'redRoom',
  'blueRoom',
  [],
  false
);

//connects: greyRoom(west) and finalRoom(south), has puzzle, is locked, needs key(redRoom) to unlock
let pinkRoom = new Room(
  'pinkRoom',
  'You are in the pink room, which the look (and smell) of it can give you a stomach ache.  However, you see a note in the middle of the room...',
  null,
  null,
  null,
  'finalRoom',
  'greyRoom',
  ['lantern'],
  true
);

//needs better name, connects: greyRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let redRoom = new Room(
  'redRoom',
  'You are in the red room.  There are 2 keys and 3 puzzle pieces.  One key will get you through to the end, the other will take you to your end.  You will need to pick up the puzzle pieces one at a time and bring it into the next room in order to use them to solve your way to get out of here alive.',
  null,
  'greyRoom',
  null,
  null,
  null,
  ['pinkRoomKey', 'blueRoomKey', 'puzzle1', 'puzzle2', 'puzzle3'],
  false
);

//connects: greyRoom(east), no items, needs key(redRoom) to unlock, if entered should console.log losing message && change status to dead
let blueRoom = new Room('blueRoom', 'You are in the blue room.  You chose poorly. Gas has encased the room and you will be dead in 3....2....', null, null, 'greyRoom', null, null, [], true);

//connects: pinkRoom(north), no items, pinkRoom puzzle unlocks, if entered console.log victory message, change status to relief
let finalRoom = new Room('finalRoom', '', null, 'pinkRoom', null, null, null, [], true);

// List of LookupTables ---------------------------------------------------------------------------------------------------------------------------------

const roomTable = {
  yellowRoom: yellowRoom,
  greyRoom: greyRoom,
  pinkRoom: pinkRoom,
  redRoom: redRoom,
  blueRoom: blueRoom,
  finalRoom: finalRoom,
};

// const mutableItemTable = {
//   signByDoor: signByDoor,
//   pinkRoomKey: pinkRoomKey,
//   blueRoomKey: blueRoomKey,
//   puzzle1: puzzle1,
//   puzzle2: puzzle2,
//   puzzle3: puzzle3,
//   lantern: lantern
// }

//const unmutableItemTable = {
//  'statue': statue,
//  'northPainting': northPainting
//
//}

//let emotionalTable = {
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

//Start up message
console.log(`\nWelcome to our awesome game! are you ready to live? Yes? or maybe no?\n\nSome helpful tips: You MUST describe the color of the door you wish to enter.\n`);
startGame();
async function startGame() {
  let answer = await ask('>_ ');

  //If yes, starts game
  if (validActions.yes.includes(sanitizeString(answer))) {
    console.log(
      `\nYou realize you are in a ${yellowRoom.description}. \nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing a door with a sign on it.\nWhat should you do?`
    );
    player.currentRoom = roomTable['yellowRoom'];
    player.currentStatus = playerEmotionalStatus.scared;
    play();
    //If no, exits game
  } else if (validActions.no.includes(sanitizeString(answer))) {
    console.log('Maybe next time?');
    process.exit();

    //checking for invalid user input
  } else if (!validActions.no.includes(answer) && !validActions.yes.includes(answer)) {
    console.log(`No idea what you\'re trying to do with the prompt: ${answer}.`);
    startGame();
  }
}

async function play() {
  let answer = await ask('>_ ');

  // Player actions --------------------------------------------------------------------------------------------------------------------------------------

  //Check inventory
  if (validActions.checkInventory.includes(answer)) {
    console.log(`You prompted: ${answer}. \nYou have: ${player.playerInventory}`);
    play();
  }

  //Check Emotional Status
  else if (validActions.checkEmotionalStatus.includes(answer)) {
    console.log(`You prompted: ${answer}. \nYou are: ${player.currentStatus}`);
    play();
  }

  //Look around the room
  else if (validActions.lookAround.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \nYou are in: ${player.currentRoom.description}`);
    play();
  }

  // yellowRoom -------------------------------------------------------------------------------------------------------------------------------------------

  // Interacting with the Statue
  else if (validActions.statue.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.statue}`);
    play();
  } else if (invalidActions.statue.includes(sanitizeString(answer))) {
    console.log(`Who do you think you are?!  You are not strong enough! Check yo self!`);
    play();
  }

  //interacting with the painting
  else if (validActions.northPainting.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.northPainting}`);
    play();
  } else if (invalidActions.northPainting.includes(sanitizeString(answer))) {
    console.log(`Who do you think you are?!  You can't take that fine piece of art from me! Check yo self!`);
    play();
  }

  // Interacting with the sign
  else if (validActions.signByDoor.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \nYou walk over to the sign and read it. \nIt states: ${itemDescrip.signByDoor}\n`);
    play();
  } else if (validActions.takeSignByDoor.includes(sanitizeString(answer))) {
  }

  //interacting with the yellowRoom door : connects to greyRoom ------------------------------------------------------------------------------------------------------------------
  else if (validActions.selectGreyDoor.includes(sanitizeString(answer))) {
    //if room is locked
    if (player.currentRoom.lock === true) {
      console.log(`You prompted: ${answer}. \nThe door is locked. Our bad. There is a keypad on the handle.`);
      play();
    }
    //if player tries to break down the door
  } else if (invalidActions.door.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}.\nYeah, theres no way you're damaging this door. Ya fool.`);
    play();
  }

  //taking valid items
  else if (validActions.pinkRoomKey.includes(sanitizeString(answer))) {
    takeItem(answer)
  }

  else if (validActions.puzzle1.includes(sanitizeString(answer))) {
    takeItem(answer)
  }
  else if (validActions.puzzle2.includes(sanitizeString(answer))) {
    takeItem(answer)
  }
  else if (validActions.puzzle3.includes(sanitizeString(answer))) {
    takeItem(answer)
  }

  else if (validActions.blueRoomKey.includes(sanitizeString(answer))) {
    takeItem(answer)
  }



  //interacting with keypad
  else if (validActions.keyCodeAction.includes(sanitizeString(answer))) {
    console.log('Please type in the code now:');
    answer = await ask('>_ ');
    //correct code for keypad
    if (validActions.keyCode.includes(sanitizeString(answer))) {
      enterRoomState('greyRoom');
      yellowRoom.lock = false;
      console.log(`You prompted: ${answer}.\nSuccess! You got in! \n\n ${greyRoom.description}\n`);
      play();
    }
    //Incorrect code for keypad
    else {
      console.log(`You prompted: ${answer}.\nFailure! Way to go! Way to use that brain power! What are you going to do now?`);
      play();
    }
  }

  //selecting colored door from greyRoom ---------------------------------------------------------------------------------------------------------------

  //Pink door
  else if (validActions.selectPinkDoor.includes(sanitizeString(answer))) {
    //if room is locked
    if (player.currentRoom.lock === true) {
      console.log(`You prompted: ${answer}. \nThe door is locked. Our bad. Try using same code as before. \n`);
      play();
    }

    //if player tries to break down the door
    if (invalidActions.door.includes(sanitizeString(answer))) {
      console.log(`You prompted: ${answer}.\nYeah, theres no way you're damaging this door. Ya fool.`);
      play();
    }

    enterRoomState('pinkRoom');
    console.log(`You prompted: ${answer}.\n${pinkRoom.description}`);
    play();
  }

  //Red door
  else if (validActions.selectRedDoor.includes(sanitizeString(answer))) {
    //if room is locked
    if (player.currentRoom.lock === true) {
      console.log(`You prompted: ${answer}. \nThe door is locked. Our bad. Try using same code as before. \n`);
      play();
    }
    //if player tries to break down the door
    if (invalidActions.door.includes(sanitizeString(answer))) {
      console.log(`You prompted: ${answer}.\nYeah, theres no way you're damaging this door. Ya fool.`);
      play();
    }
    enterRoomState('redRoom');
    console.log(`You prompted: ${answer}.\n  ${redRoom.description}`);
    play();
  }

  //Blue door
  else if (validActions.selectBlueDoor.includes(sanitizeString(answer))) {
    //if room is locked
    if (player.currentRoom.lock === true) {
      console.log(`You prompted: ${answer}. \nThe door is locked. Our bad. Try using same code as before. \n`);
      play();
    }
    //if player tries to break down the door
    if (invalidActions.door.includes(sanitizeString(answer))) {
      console.log(`You prompted: ${answer}.\nYeah, theres no way you're damaging this door. Ya fool.`);
      play();
    }
    enterRoomState('blueRoom');
    console.log(`You prompted: ${answer}.\n  ${blueRoom.description}`);
    process.exit()
  }

  //checking inventory
  else if (validActions.checkInventory.includes(answer)) {
    console.log(`You prompted: ${answer}. \n You have: ${player.playerInventory} items`);
    if (player.playerInventory === '') {
      console.log(`You have nothing in your arms.`);
    }
    play();
  }




  // Interacting with the Statue
  else if (validActions.statue.includes(sanitizeString(answer))) {
    console.log(`You prompted: ${answer}. \n\nYou see a ${itemDescrip.statue}`);
    play();
  } else if (invalidActions.statue.includes(sanitizeString(answer))) {
    console.log(`Who do you think you are?!  You are not strong enough! Check yo self!`);
    play();
    process.exit();
  }

  // Checks for invalid user input ---------------------------------------------------------------------------------------------------------------------
  else {
    console.log(`Invaild prompt: ${answer}`);
    play();
  }
}

 //if user hits exit at any point
// if(answer === 'exit'){
//    console.log("Come on, don't be scared, figure out how to get out of the room!")
// process.exit()
// 
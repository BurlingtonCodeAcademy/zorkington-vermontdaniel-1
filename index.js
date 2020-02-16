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
  pinkRoom: { canChangeTo: ['greyRoom', 'goldenRoom'] },
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

//Moves from one room to another
function enterRoomState(newRoomState) {
  let validTransitions = roomStates[currentRoomState].canChangeTo;

  //Checks if the room you want to move into is locked
  if (roomTable[newRoomState].lock === true) {
    console.log("\nSorry, that door is locked.\nMaybe you'll figure a way to unlock it.\nI highly doubt it though.\n");

    //Moves the player from one room to the next
  } else if (validTransitions.includes(newRoomState)) {
    console.log(`\nMoving from ${currentRoomState} to ${newRoomState}.\n`);
    currentRoomState = newRoomState;
    player.currentRoom = roomTable[currentRoomState];
    console.log(roomTable[currentRoomState].description);

    //Checks if rooms are connected
  } else {
    console.log(`\nInvalid pathway - from ${currentRoomState} to ${newRoomState}.\n`);
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

//For being able to take item
function takeItem(item) {
  if (validActions.includes(item)) {
    console.log(`You are allowed to take ${item}`);
    playerInventory = item;
    console.log(`Your current inventory is: ` + playerInventory);
  } else {
    console.log(`Nope! Can't take the ${item} with you!`);
    console.log(`Your current inventory is: ` + playerInventory);
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
  constructor(roomName, description, roomInventory, lock) {
    this.roomName = roomName;
    this.description = description;
    this.roomInventory = roomInventory || [];
    this.lock = lock;
  }
}

//list of objects ---------------------------------------------------------------------------------------------------------------------------------------
const playerEmotionalStatus = {
  dead: 'dead',
  relief: 'relief',
  scared: 'scared',
};

const validActions = {
  //Valid item user input
  pinkRoomKey: ['take key', 'my key now', 'key is mine'],
  blueRoomKey: ['take key', 'i want key', 'taking key'],
  puzzle1: ['pick up first puzzle piece', 'pick up 1 puzzle piece', 'pick up first puzzle', 'grab 1 puzzle piece', 'take puzzle 1'],
  puzzle2: ['pick up second puzzle piece', 'pick up 2 puzzle piece', 'pick up second puzzle', 'grab 2 puzzle piece', 'take puzzle 2'],
  puzzle3: ['pick up third puzzle piece', 'pick up 3 puzzle piece', 'pick up third puzzle', 'grab 3 puzzle piece', 'take puzzle 3'],
  lantern: ['take lantern', 'steal lantern', 'grab lantern', 'my lantern'],

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
  keyCodeAnswer: ['0314'],

  //Valid Door User Input
  selectPinkDoor: ['open pink door', 'open pink', 'pink door', 'go in pink door', 'enter pink room', 'go in pink', 'enter pink door'],
  selectRedDoor: ['open red door', 'open red', 'red door', 'go in red door', 'enter red room', 'go in red', 'enter red door'],
  selectBlueDoor: ['open blue door', 'open blue', 'blue door', 'go in blue door', 'enter blue room', 'go in blue', 'enter blue door'],
  selectGreyDoor: ['open grey door', 'open grey', 'grey door', 'go in grey door', 'enter grey room', 'go in grey', 'enter grey door'],
  selectYellowDoor: ['open yellow door', 'open yellow', 'yellow door', 'go in yellow door', 'enter yellow room', 'go in yellow', 'enter yellow door'],
  selectGoldenDoor: ['open golden door', 'open golden', 'golden door', 'go in golden door', 'enter golden room', 'go in golden', 'enter golden door'],
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

//connects: greyRoom, has three items and is locked.
let yellowRoom = new Room(
  'yellowRoom',
  `You are in a dirty yellow, dark, dingy, smelly room. \nAgainst one of the walls is a ${itemDescrip.statue}\nOn another wall is a ${itemDescrip.northPainting}\nThere is a single grey door.\n`,
  ['statue', 'northPainting', 'signByDoor'],
  false
);

//connects to 4 rooms, no items, is unlocked
let greyRoom = new Room(
  'greyRoom',
  'You are in a sterile and cold grey room that has 3 more separate doors - \neach with a different color - baby blue, pepto bismal pink, and blood red.\nLooking behind you, you see that the grey door is yellow on this side of it. \nIf you select correctly, you may get out of here alive.  \nIf you select the wrong room....YOU WILL DIE!\n',
  [],
  true
);

//connects: greyRoom) and goldenRoom, has puzzle, is locked, needs key(redRoom) to unlock
let pinkRoom = new Room('pinkRoom', 'You are in a pink room, which the look (and smell) of it can give you a stomach ache.  However, you see a note in the middle of the room...\n', ['lantern'], true);

//needs better name, connects: greyRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let redRoom = new Room(
  'redRoom',
  'You are in a red room.  There are 2 keys and 3 puzzle pieces.  One key will get you through to the end, the other will take you to your end.  You will need to pick up the puzzle pieces one at a time and bring it into the next room in order to use them to solve your way to get out of here alive.\n',
  ['pinkRoomKey', 'blueRoomKey', 'puzzle1', 'puzzle2', 'puzzle3'],
  false
);

//connects: greyRoom(east), no items, needs key(redRoom) to unlock, if entered should console.log losing message && change status to dead
let blueRoom = new Room('blueRoom', 'You are in a blue room.  You chose poorly. Gas has encased the room and you will be dead in 3....2....\n', [], true);

//connects: pinkRoom(north), no items, pinkRoom puzzle unlocks, if entered console.log victory message, change status to relief
let goldenRoom = new Room('goldenRoom', 'You are in a golden room.\n', [], true);

// List of LookupTables ---------------------------------------------------------------------------------------------------------------------------------

const roomTable = {
  yellowRoom: yellowRoom,
  greyRoom: greyRoom,
  pinkRoom: pinkRoom,
  redRoom: redRoom,
  blueRoom: blueRoom,
  goldenRoom: goldenRoom,
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
    console.log(`\n${yellowRoom.description}\nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing a door with a sign on it.\nWhat should you do?\n`);
    player.currentRoom = roomTable['yellowRoom'];
    player.currentStatus = playerEmotionalStatus.scared;
    play();
    //If no, exits game
  } else if (validActions.no.includes(sanitizeString(answer))) {
    console.log('\nMaybe next time?');
    process.exit();

    //checking for invalid user input
  } else if (!validActions.no.includes(answer) && !validActions.yes.includes(answer)) {
    console.log(`\nNo idea what you\'re trying to do with the prompt: ${answer}.\n`);
    startGame();
  }
}

async function play() {
  let answer = await ask('>_ ');

  // Player actions --------------------------------------------------------------------------------------------------------------------------------------

  //Check inventory
  if (validActions.checkInventory.includes(answer)) {
    console.log(`\nYou have: ${player.playerInventory}\n`);
    play();
  }

  //Check Emotional Status
  else if (validActions.checkEmotionalStatus.includes(answer)) {
    console.log(`\nYou are: ${player.currentStatus}\n`);
    play();
  }

  //Look around the room, not working %100
  else if (validActions.lookAround.includes(sanitizeString(answer))) {
    console.log(`\nYou are in: ${player.currentRoom.description}`);
    play();
  }

  // yellowRoom ------------------------------------------------------------------------------------------------------------------------------------------

  // Interacting with the Statue
  else if (validActions.statue.includes(sanitizeString(answer))) {
    console.log(`\nYou see a ${itemDescrip.statue}\n`);
    play();
  } else if (invalidActions.statue.includes(sanitizeString(answer))) {
    console.log(`\nWho do you think you are?!  You are not strong enough! Check yo self!\n`);
    play();
  }

  //interacting with the painting
  else if (validActions.northPainting.includes(sanitizeString(answer))) {
    console.log(`\nYou see a ${itemDescrip.northPainting}\n`);
    play();
  } else if (invalidActions.northPainting.includes(sanitizeString(answer))) {
    console.log(`\nWho do you think you are?!  You can't take that fine piece of art from me! Check yo self!\n`);
    play();
  }

  // Interacting with the sign
  else if (validActions.signByDoor.includes(sanitizeString(answer))) {
    console.log(`\nYou walk over to the sign and read it. \nIt states: ${itemDescrip.signByDoor}\n`);
    play();
  } else if (validActions.takeSignByDoor.includes(sanitizeString(answer))) {
  }

  //taking valid items
  else if (validActions.pinkRoomKey.includes(sanitizeString(answer))) {
    takeItem(answer);
  } else if (validActions.puzzle1.includes(sanitizeString(answer))) {
    takeItem(answer);
  } else if (validActions.puzzle2.includes(sanitizeString(answer))) {
    takeItem(answer);
  } else if (validActions.puzzle3.includes(sanitizeString(answer))) {
    takeItem(answer);
  } else if (validActions.blueRoomKey.includes(sanitizeString(answer))) {
    takeItem(answer);
  } else if (validActions.blueRoomKey.includes(sanitizeString(answer))) {
    takeItem(answer);
  }

  //interacting with keypad
  else if (validActions.keyCodeAction.includes(sanitizeString(answer))) {
    console.log('\nPlease type in the code now:\n');
    answer = await ask('>_ ');
    //correct code for keypad
    if (validActions.keyCodeAnswer.includes(sanitizeString(answer))) {
      greyRoom.lock = false;
      enterRoomState('greyRoom');
      play();
    }
    //Incorrect code for keypad
    else {
      console.log(`\nFailure! Way to go! Way to use that brain power! What are you going to do now?\n`);
      play();
    }
  }

  //selecting colored door ---------------------------------------------------------------------------------------------------------------

  //Grey door
  else if (validActions.selectGreyDoor.includes(sanitizeString(answer))) {
    enterRoomState('greyRoom');
    play();
  }

  //Yellow door
  else if (validActions.selectYellowDoor.includes(sanitizeString(answer))) {
    enterRoomState('yellowRoom');
    play();
  }

  //Pink door
  else if (validActions.selectPinkDoor.includes(sanitizeString(answer))) {
    enterRoomState('pinkRoom');
    play();
  }

  //Red door
  else if (validActions.selectRedDoor.includes(sanitizeString(answer))) {
    enterRoomState('redRoom');
    play();
  }

  //Blue door
  else if (validActions.selectBlueDoor.includes(sanitizeString(answer))) {
    if (blueRoom.lock === true) {
      enterRoomState('blueRoom');
      play();
    } else {
      console.log(blueRoom.description)
      process.exit()
    }
  }

  //Golden door
  else if (validActions.selectGoldenDoor.includes(sanitizeString(answer))) {
    enterRoomState('goldenRoom');
    play();
  }

  // Checks for invalid user input ---------------------------------------------------------------------------------------------------------------------
  else {
    console.log(`\nInvaild prompt: ${answer}\n`);
    play();
  }
}

//if user hits exit at any point
// if(answer === 'exit'){
//    console.log("Come on, don't be scared, figure out how to get out of the room!")
// process.exit()
//


/** Overall, really great job! You completed all of the stories and went on to add more rooms and stories. The story line is pretty creative, I like it!
 *  Your code is very neat and organized. Your comments are sufficient for anyone to know what's happening in each part of your code. I like your use
 *  of a state machine to control the players emotional status! Very cool. I don't have a ton of comments for you. You have a good understanding of functions,
 *  objects and classes, and the rest of the topics and lessons discussed during week 2 and how they all work together. Great job. **/
const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

/********************************************************************************************************************************************************/
// State Machines ----------------------------------------------------------------------------------------------------------------------------------------

/** Great use of state machines to restrict room movement and player emotion status **/
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

//list of functions---------------------------------------------------------------------------------------------------------------------------------------

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

/** Nice use of a helper function to sanitize the user's input**/
//Sanitizes user input to valid format
function sanitizeString(string) {
  string = string
    .toString()
    .trim()
    .toLowerCase();

  return string;
}

/** These functions here are good. Since they are actions that a player does, one thing you could try to do is attach these to a Player object or class
 *  and call them through an instance of a player! **/
function takeItem(item) {
  console.log(`\nYou are allowed to take the ${item}`);
  let indexOfItem = roomTable[currentRoomState].roomInventory.indexOf(item);
  let roomItem = roomTable[currentRoomState].roomInventory.splice(indexOfItem, 1);
  player.playerInventory.push(roomItem.join(''));
  console.log(`\nYour current inventory is: ${player.playerInventory.join(', ')}.\n`);
}

//for being able to drop item
function dropItem(item) {
  let indexOfItem = player.playerInventory.indexOf(item);
  let playerItem = player.playerInventory.splice(indexOfItem, 1);
  roomTable[currentRoomState].roomInventory.push(playerItem);
  console.log(`\nYou just dropped ${item} it like it's hot\n`);
  console.log(`\nYour current inventory is: ${player.playerInventory.join(', ')}\n`);
}

//Changes player emotional state
function changeEmotion(change) {
  if (playerEmotionalState[currentEmotionalState].canChangeTo.includes(change)) {
    currentEmotionalState = change;
    player.currentStatus = currentEmotionalState;
    console.log(`\nYou are feeling ${currentEmotionalState}!`);
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

/** I like the extensive list of actions and different ways that someone can do something. Nice! **/
const validActions = {
  //Valid item user input
  takePinkRoomKey: ['take pink key', 'my pink key now', 'pink key is mine', 'pick up pink key'],
  dropPinkRoomKey: ['drop pink key', 'throw pink key', 'get rid of pink key'],
  takeBlueKey: ['take blue key', 'i want blue key', 'taking blue key', 'pick up blue key'],
  dropBlueKey: ['drop blue key', 'throw blue key', 'get rid of blue key'],
  takePurpleTriangle: ['pick up purple triange', 'pick up purple triange', 'pick up purple triange', 'grab purple triange', 'take purple triangle'],
  dropPurpleTriangle: ['drop purple triangle', 'drop the purple triangle'],
  takeOrangeTriangle: ['pick up orange triangle', 'pick up orangle triangle', 'pick up orangle triange', 'grab orange triangle', 'take orange triangle'],
  dropOrangeTriangle: ['drop orange triangle', 'drop the orange triangle'],
  takeGreenTriangle: ['pick up green triangle', 'pick up green triangle', 'pick up green triangle', 'grab green triangle', 'take green triangle'],
  dropGreenTriangle: ['drop green triangle', 'drop the green triangle'],
  combineTriangles: ['combine triangles', 'put together triangles', 'connect triangles', 'connect the triangles'],
  signByDoor: ['read sign', 'read the sign', 'look at the sign', 'examine the sign', 'examine sign', 'sign', 'take sign', 'pi'],
  takeSignByDoor: ['take sign', 'take the sign', 'remove the sign', 'remove sign'],
  dropSignByDoor: ['drop sign', 'drop the sign'],
  statue: ['look at statue', 'examine statue', 'look at the statue', 'examine the statue', 'statue', 'look at statue of angel', 'look at angel statue', 'look at the statue of the angel'],
  northPainting: ['look at painting', 'examine painting', 'look at the painting', 'examine the painting', 'painting'],
  useTriforce: ['insert triforce', 'use triforce'],
  takeTriforce: ['take triforce', 'pick up triforce', 'grab triforce'],
  dropTriforce: ['drop triforce', 'drop the triforce'],

  //Valid Player User Input
  checkInventory: ['i', 'inventory', 'check inventory', 'inv'],
  checkEmotionalStatus: ['s', 'check status', 'status', 'check emotional status'],
  yes: ['yes', 'yeah', 'y', 'yes ready'],
  no: ['no', 'n', 'not ready'],
  lookAround: ['look around', 'look around room', 'examine the room', 'examine room', 'l'],

  // yellowRoom user inputs
  keyCodeAction: ['enter code', 'code in', 'key', 'key in', 'code', 'key code', 'code key'],
  keyCodeAnswer: ['0314'],

  //Valid Door User Input
  selectPinkDoor: ['open pink door', 'open pink', 'pink door', 'go in pink door', 'enter pink room', 'go in pink', 'enter pink door'],
  unlockPinkDoor: ['unlock pink door', 'use pink key on pink door', 'unlock pink door with pink key', 'unlock pink room'],
  selectBlueDoor: ['open blue door', 'open blue', 'blue door', 'go in blue door', 'enter blue room', 'go in blue', 'enter blue door'],
  unlockBlueDoor: ['unlock blue door', 'use blue key on blue door', 'unlock blue door with blue key', 'unlock blue room'],
  selectRedDoor: ['open red door', 'open red', 'red door', 'go in red door', 'enter red room', 'go in red', 'enter red door'],
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
  purpleTriangle: 'It is a small purple triangle puzzle piece, not heavy, but appears to be made out of wood.',
  orangeTriangle: 'It is a triangle-shaped orange puzzle piece, not heavy, but appears to be made out of wood.',
  greenTriangle: 'It is a green triangle puzzle piece - made of wood and similar size as the other puzzle pieces.',
  pinkKey: 'A semi rusty old key, it clearly was once painted completely pink.',
  blueKey: 'A key made completely out of blue saphire.',
  signByDoor:
    'There is only 1 safe way out - if you choose poorly, you will meet your demise. \nRead carefully and choose wisely to get out of here....Alive!\nThe keypad accepts only four numbers!\nDate: Pie Day',
  statue: "partially destroyed marble statue of an angel. \nIt's nose is missing and only one finger is left of its right hand.",
  northPainting: 'beautiful yet gothic oil painting of 3 cats playing poker.',
  triforce: 'shining pyramid of connecting green, purple, and orange triangles!',
};

//list of rooms------------------------------------------------------------------------------------------------------------------------------------------

//connects: greyRoom, has three items and is locked.
let yellowRoom = new Room(
  'yellowRoom',
  `You are in a dirty yellow, dark, dingy, smelly room. \nAgainst one of the walls is a ${itemDescrip.statue}\nOn another wall is a ${itemDescrip.northPainting}\nThere is a single grey door with a keypad attached to it.\nThere is also a sign next to the door as well.\n`,
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
let pinkRoom = new Room(
  'pinkRoom',
  'You are in a pink room, which the look (and smell) of it can give you a stomach ache.\nThere are 3 triangles, one purple, one orange, and one green. \nEach having what appears to be connecting mechanisms on two of their corners.\n',
  ['purpleTriangle', 'orangeTriangle', 'greenTriangle'],
  true
);

//needs better name, connects: greyRoom(north), has 2 keys, and three puzzle pieces, is unlocked
let redRoom = new Room(
  'redRoom',
  'You are in a red room.\nThere is a pink key and a blue key.\nAt the end of the room is a golden door.\nNext to it looks to be one empty triangular insert forming a pyramid made of three triangles.\n',
  ['pinkKey', 'blueKey'],
  false
);

//connects: greyRoom(east), no items, needs key(redRoom) to unlock, if entered should console.log losing message && change status to dead
let blueRoom = new Room('blueRoom', '\nYou are in a blue room.  You chose poorly. Gas has encased the room and you will be dead in 3....2....\n', [], true);

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

// Player Information ------------------------------------------------------------------------------------------------------------------------------------
let player = {
  playerInventory: [],
  currentRoom: null,
  currentStatus: null,
};

// Game Function -----------------------------------------------------------------------------------------------------------------------------------------

//Start up message
console.log(
  `\nWelcome to our awesome game!\n\nSome helpful tips: color really matters in this game when it comes to interacting with things!\n\nCommands:\ni = checks inventory\nl = checks your location\ns = checks your emotional status\n\nAre you ready to live? Yes? or maybe no?\n`
);

startGame();
async function startGame() {
  let answer = await ask('>_ ');

  //If yes, starts game
  if (validActions.yes.includes(sanitizeString(answer))) {
    console.log(`\n${yellowRoom.description}\nYou don't know how you got here, and frankly don't even remember your name! \nYou are facing the door with a sign on it.\nWhat should you do?\n`);
    player.currentRoom = roomTable['yellowRoom'];
    player.currentStatus = playerEmotionalStatus.scared;
    console.log(`You are feeling ${player.currentStatus}!\n`);
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
    console.log(`\nYou have: ${player.playerInventory.join(', ')}\n`);
    play();
  }

  //Check Emotional Status
  else if (validActions.checkEmotionalStatus.includes(answer)) {
    console.log(`\nYou are feeling: ${player.currentStatus}\n`);
    play();
  }

  //Look around the room
  else if (validActions.lookAround.includes(sanitizeString(answer))) {
    console.log(`\n${player.currentRoom.description}`);
    play();
  }

  //Taking Items -----------------------------------------------------------------------------------------------------------------------------------------

  // Pink Key
  else if (validActions.takePinkRoomKey.includes(sanitizeString(answer))) {
    takeItem('pinkKey');
    play();
  }

  // Blue Key
  else if (validActions.takeBlueKey.includes(sanitizeString(answer))) {
    takeItem('blueKey');
    play();
  }

  // Purple Triangle
  else if (validActions.takePurpleTriangle.includes(sanitizeString(answer))) {
    takeItem('purpleTriangle');
    play();
  }

  // Orange Triangle
  else if (validActions.takeOrangeTriangle.includes(sanitizeString(answer))) {
    takeItem('orangeTriangle');
    play();
  }

  //Green Triangle
  else if (validActions.takeGreenTriangle.includes(sanitizeString(answer))) {
    takeItem('greenTriangle');
    play();
  }

  //Triforce
  else if (validActions.takeTriforce.includes(sanitizeString(answer))) {
    takeItem('triforce');
    play();
  }

  //Sign by door
  else if (validActions.takeSignByDoor.includes(sanitizeString(answer))) {
    takeItem('signByDoor');
    play();
  }

  // Dropping Items --------------------------------------------------------------------------------------------------------------------------------------------------------

  // Pink Key
  else if (validActions.dropPinkRoomKey.includes(sanitizeString(answer))) {
    dropItem('pinkKey');
    play();
  }

  //Blue Key
  else if (validActions.dropBlueKey.includes(sanitizeString(answer))) {
    dropItem('blueKey');
    play();
  }

  //Purple Triangle
  else if (validActions.dropPurpleTriangle.includes(sanitizeString(answer))) {
    dropItem('purpleTriangle');
    play();
  }

  //Orange Triangle
  else if (validActions.dropOrangeTriangle.includes(sanitizeString(answer))) {
    dropItem('orangeTriangle');
    play();
  }

  //Green Triangle
  else if (validActions.dropGreenTriangle.includes(sanitizeString(answer))) {
    dropItem('greenTriangle');
    play();
  }

  //Triforce
  else if (validActions.dropTriforce.includes(sanitizeString(answer))) {
    dropItem('triforce');
    play();
  }

  //Sign By Door
  else if (validActions.dropSignByDoor.includes(sanitizeString(answer))) {
    dropItem('signByDoor');
    play();
  }

  //Grey Room --------------------------------------------------------------------------------------------------------------------------------------------

  //Entering Grey door
  else if (validActions.selectGreyDoor.includes(sanitizeString(answer))) {
    enterRoomState('greyRoom');
    play();
  }

  // yellowRoom ------------------------------------------------------------------------------------------------------------------------------------------

  //Entering yellow room
  else if (validActions.selectYellowDoor.includes(sanitizeString(answer))) {
    enterRoomState('yellowRoom');
    play();
  }

  // Interacting with the Statue
  else if (validActions.statue.includes(sanitizeString(answer))) {
    console.log(`\nYou see a ${itemDescrip.statue}\n`);
    play();
  } else if (invalidActions.statue.includes(sanitizeString(answer))) {
    console.log(`\nWho do you think you are?!  You are not strong enough! You better check yo self!\n`);
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
    console.log(`\nIt states: ${itemDescrip.signByDoor}\n`);
    play();
  }

  //interacting with keypad
  else if (validActions.keyCodeAction.includes(sanitizeString(answer))) {
    console.log('\nPlease type in the code now:\n');
    answer = await ask('>_ ');
    //correct code for keypad
    if (validActions.keyCodeAnswer.includes(sanitizeString(answer))) {
      greyRoom.lock = false;
      changeEmotion('relief');
      console.log('\nThe keypad beeps three times! Maybe the door is unlocked now?\n');
      play();
    }
    //Incorrect code for keypad
    else {
      console.log(`\nFailure in code! Way to go!\nWay to use that brain power! What are you going to do now?\n`);
      play();
    }
  }

  // blueRoom --------------------------------------------------------------------------------------------------------------------------------------------

  //Entering blue room
  else if (validActions.selectBlueDoor.includes(sanitizeString(answer))) {
    if (blueRoom.lock === true) {
      enterRoomState('blueRoom');
      play();
    } else {
      console.log(blueRoom.description);
      process.exit();
    }
  }

  //Unlocking blue door
  else if (validActions.unlockBlueDoor.includes(sanitizeString(answer))) {
    if (player.playerInventory.includes('blueKey') && player.currentRoom === roomTable['greyRoom']) {
      blueRoom.lock = false;
      console.log('\nYou unlocked the blue door!\n');
      play();
    } else if (player.currentRoom !== roomTable['greyRoom']) {
      console.log("\nYou aren't even in the same room as the blue door, you dingus!\n");
      play();
    } else {
      console.log('\nNo key? How are you going to unlock a door without the key?\n');
      play();
    }
  }

  // Pink room -------------------------------------------------------------------------------------------------------------------------------------------

  //Entering Pink Room
  else if (validActions.selectPinkDoor.includes(sanitizeString(answer))) {
    enterRoomState('pinkRoom');
    play();
  }

  // Unlocking pink door
  else if (validActions.unlockPinkDoor.includes(sanitizeString(answer))) {
    if (player.playerInventory.includes('pinkKey') && player.currentRoom === roomTable['greyRoom']) {
      pinkRoom.lock = false;
      console.log('\nYou unlocked the pink door!\n');
      play();
    } else if (player.currentRoom !== roomTable['greyRoom']) {
      console.log("\nYou aren't even in the same room as the pink door, you dingus!\n");
      play();
    } else {
      console.log('\nNo key? How are you going to unlock a door without the key?\n');
      play();
    }
  }

  //Red Room----------------------------------------------------------------------------------------------------------------------------------------------

  //Entering red room
  else if (validActions.selectRedDoor.includes(sanitizeString(answer))) {
    enterRoomState('redRoom');
    play();
  }

  //Form the triforce
  else if (validActions.combineTriangles.includes(sanitizeString(answer))) {
    if (player.playerInventory.includes('orangeTriangle', 'purpleTriangle', 'greenTriangle')) {
      console.log(`\nYou formed the triforce!\n`);
      player.playerInventory.push('triforce');
      play();
    }
  }

  //Golden Room ------------------------------------------------------------------------------------------------------------------------------------------

  //Entering Golden room
  else if (validActions.selectGoldenDoor.includes(sanitizeString(answer))) {
    if (goldenRoom.lock === true) {
      enterRoomState('goldenRoom');
      play();
    } else {
      console.log("\nYou did it! Somehow we didn't kill you!\nYou should feel special about that!\nWe hope there aren't too many hard feelings!\n");
      process.exit();
    }
  }

  //Unlock Golden door
  else if (validActions.useTriforce.includes(sanitizeString(answer))) {
    if (player.playerInventory.includes('triforce') && player.currentRoom === roomTable['redRoom']) {
      goldenRoom.lock = false;
      console.log('\nYou hear mechanisms turning and finally an audible pop!\nThe door is unlocked!\n');
      play();
    } else if (player.currentRoom !== roomTable['redRoom']) {
      console.log("\nYou aren't even in the same room as the triangle inserts, you dingus!\n");
      play();
    } else {
      console.log('\nPretty sure you need to insert something.\n');
    }
  }

  // Checks for invalid user input -----------------------------------------------------------------------------------------------------------------------
  else {
    console.log(`\nInvalid prompt: ${answer}\n`);
    play();
  }
}

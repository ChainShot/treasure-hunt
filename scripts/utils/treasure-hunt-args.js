require('dotenv').config();
const { ethers } = require('hardhat');
const clues = [
  'Shiver me timbers! You are well on your way. Venture further to the Hall of Numbered Doors. The next clue will be found behind a door with a number less than 10 and rhymes with blue.',
  'Blimey...you may very well beat me on your quest for the treasure. Look next to the guard towers of the Ice Wall. In the 4th tower you will find what you what you seek.',
  "Every proper pirate ship has at least 3 shipmates. Take a peek into the Second Mate's locker, but don't get caught. You'll find more than just rum in his flask.",
  "Well, well, you have not much further to go. 'x' marks the spot of any true treasure. Delay not and find the value of 'x' now!",
];

const w = 108;
const x = 33;
const y = 47;

const treasureAmountInEth = process.env.TREASURE_AMOUNT_IN_ETH

const treasure = `Blow Captain Keccak down! I didn't bet ye'd make it this far, but the treasure ye have found! Your mastery of Storage Layout in Solidity has led you to a treasure of ${treasureAmountInEth} ETH! Check ye balance. Congratulations!`;

module.exports = [
  clues[0],
  clues[1],
  clues[2],
  clues[3],
  w,
  x,
  y,
  x + '',
  treasure,
  ethers.utils.parseEther(treasureAmountInEth)
];

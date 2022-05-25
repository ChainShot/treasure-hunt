require('dotenv').config();
const { ethers } = require('hardhat');
const { getStringAt } = require('./utils/solidity-string-utils');

const TREASURE_HUNT_CONTRACT_ADDR = process.env.TREASURE_HUNT_CONTRACT_ADDR;

async function main() {
  //
  // Take the information from the previous clue and use it to calculate the
  // storage slot of the next clue found here. Set the `clueStorageSlot`
  // variable in the code below to the value you calculate.
  //
  // Once you've done that, run this script with:
  //
  //   `npx hardhat run scripts/04_Clue.js`
  //
  // to print out the clue.
  //
  // If the clue printed out is an empty string, then you have calculated an
  // incorrect storage slot. Try your calculation again.
  //
  // Once you've found the clue here, use this information and move on to
  // `scripts/05_Clue.js` to find the next clue there.
  //

  // CACULATE THE STORAGE SLOT FROM THE PREVIOUS CLUE'S INFO
  const clueStorageSlot = '';
  const clue = await getStringAt(TREASURE_HUNT_CONTRACT_ADDR, clueStorageSlot);

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

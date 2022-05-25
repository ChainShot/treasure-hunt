require('dotenv').config();
const { getStringAt } = require('./utils/solidity-string-utils');

const TREASURE_HUNT_CONTRACT_ADDR = process.env.TREASURE_HUNT_CONTRACT_ADDR;

async function main() {
  //
  // Start off and read the first clue of the treasure hunt. The first clue is
  // stored in the `startHere` state variable of the `TreasureHunt` contract.
  //
  // Your task is to calculate the storage slot of `startHere` and set the
  // `clueStorageSlot` variable in the code below to the value you calculate.
  //
  // Once you've done that, run this script with:
  //
  //   `npx hardhat run scripts/01_StartHere.js`
  //
  // to print out the clue.
  //
  // If the clue printed out is an empty string, then you have calculated an
  // incorrect storage slot. Try your calculation again.
  //
  // Once you've found the clue here, use this information and move on to
  // `scripts/02_Clue.js` to find the next clue there.
  //

  //
  // The treasure hunt has just started, so this is a good warmup exercise.
  // The rationale and calculation of the first clue is provided below. Use
  // this as an example to work through the subsequent clues.
  // 
  // Because `startHere` is the first state variable in the `TreasureHunt` its
  // storage slot is `0x0`, so `clueStorageSlot` is set to this value.
  //
  const clueStorageSlot = '0x0';
  const clue = await getStringAt(TREASURE_HUNT_CONTRACT_ADDR, clueStorageSlot);

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

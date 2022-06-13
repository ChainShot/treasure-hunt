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
  //   `npx hardhat run scripts/02_Clue.js --network rinkeby`
  //
  // to print out the clue.
  //
  // If the clue printed out is an empty string, then you have calculated an
  // incorrect storage slot. Try your calculation again.
  //
  // Once you've found the clue here, use this information and move on to
  // `scripts/03_Clue.js` to find the next clue there.
  //

  //
  // The clue from the previous step leads us to read the string at
  // `hallOfNumberedDoors[2]`.
  //
  // `hallOfNumberedDoors` is a dynamic array of strings. Its marker slot
  // is at 0x2. Each element of the string array is laid out in storage
  // consecutively.
  //
  // The length of the array is stored in the 0x2 marker slot, but the actual
  // data of the array starts at slot `keccak256(0x2)`.
  //
  // To calculate the storage slot for `hallOfNumberedDoors[2]`, we first
  // calculate the starting slot of the array's data and then add 2 to it as an
  // offset to read element 2 of the array.
  //
  // The calulation is:
  //
  //   keccak256(0x2) + 2
  //
  const hallOfNumberedDoorsBaseSlot = ethers.utils.keccak256(
    ethers.utils.hexZeroPad('0x2', 32)
  );

  const clueStorageSlot = ethers.BigNumber.from(hallOfNumberedDoorsBaseSlot)
    .add(2)
    .toHexString();
  const clue = await getStringAt(TREASURE_HUNT_CONTRACT_ADDR, clueStorageSlot);

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

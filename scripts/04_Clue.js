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

  //
  // The clue from the previous step leads us to read the value stored at
  // `shipmatesLockers[1].flaskOfRum`
  //
  // `shipmatesLockers` is a dynamic array of type `LockerContents`. The
  // array's marker slot is at 0x4.
  //
  // The length of the array is stored in the 0x4 marker slot, but the actual
  // data of the array starts at slot `keccak256(0x4)`.
  //
  // Because `shipmatesLockers` is an array of `LockerContents`, the size (in
  // storage slots) of this data type must be calculated.
  //
  // Looking at the elements of the `LockerContents` struct we see:
  //
  //   slot 0 = goldCoins    (uint256 = 1 slot)
  //   slot 1 = flaskOfRum   (string  = 1 slot)
  //   slot 2 = pairOfBoots  (string  = 1 slot)
  //
  // Therefore each `LockerContents` element takes up 3 storage slots.
  //
  // Variables in a struct are laid out consecutively in storage similarly to
  // regular variables. Since array data and struct data are both laid out
  // consecutively, the variable `shipmatesLockers[1].flaskOfRum` will be
  // located 4 storage slots after the `shipmatesLockers[0].goldCoins`, which
  // is the first data slot of the `shipmatesLockers` array.
  //
  // To calculate the storage slot for shipmatesLockers[1].flaskOfRum, we first
  // calculate the starting slot of the array's data and then add 4 to it as an
  // offset to read specific `flaskOfRum` element in the struct.
  //
  // The calulation is:
  //
  //   keccak256(0x4) + 4
  //
  const shipmatesLockersBaseSlot = ethers.utils.keccak256(
    ethers.utils.hexZeroPad('0x4', 32)
  );

  const clueStorageSlot = ethers.BigNumber.from(shipmatesLockersBaseSlot)
    .add(4)
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

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
  //   `npx hardhat run scripts/03_Clue.js --network rinkeby`
  //
  // to print out the clue.
  //
  // If the clue printed out is an empty string, then you have calculated an
  // incorrect storage slot. Try your calculation again.
  //
  // Once you've found the clue here, use this information and move on to
  // `scripts/04_Clue.js` to find the next clue there.
  //

  //
  // The clue from the previous step leads us to read the string at
  // `iceWallGuardTowers[4]`.
  //
  // `iceWallGuardTowers` is a mapping of strings. Its marker slot is at 0x1.
  //
  // The 0x1 marker slot only marks the fact that there is a mapping, but
  // stores no additional data. The actual data value of a mapping at a
  // specific key is found using the following calculation:
  //
  //   keccak256(h(key) + markerSlot)
  //
  // where both h(key) and markerSlot are both hexadecimal strings padded out
  // to 32 bytes and the '+' represents string concatenation. Addionally,
  // before the 2 strings are concatenated the `0x` prefix is stripped off of
  // markerSlot.
  //
  // The calculation for `iceWallGuardTowers[4]` is:
  //
  //   keccak256(h(4) + '1')
  //
  const the4thGuardedTowerKey = ethers.utils.hexZeroPad('0x4', 32);
  const the4thGuardedTowerMarkerSlot = ethers.utils.hexZeroPad('0x1', 32);

  const clueStorageSlot = ethers.utils.keccak256(
    the4thGuardedTowerKey + the4thGuardedTowerMarkerSlot.slice(2)
  );
  const clue = await getStringAt(TREASURE_HUNT_CONTRACT_ADDR, clueStorageSlot);

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

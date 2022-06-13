require('dotenv').config();
const { ethers } = require('hardhat');

const TREASURE_HUNT_CONTRACT_ADDR = process.env.TREASURE_HUNT_CONTRACT_ADDR;

async function main() {
  //
  // Take the information from the previous clue and use it to calculate the
  // storage slot of the next clue found here. Set the `clueStorageSlot`
  // variable in the code below to the value you calculate.
  //
  // In this step, in addition to setting and reading the data from the
  // correct slot, you will also need to unpack byte-packed variables from
  // the storage slot and extract the correct variable.
  //
  // Also note that in this step use `ethers.provider.getStorageAt()` to
  // read the contract data. Do not use `getStringAt()` because string
  // data is not being read here.
  //
  // Once you've done that, run this script with:
  //
  //   `npx hardhat run scripts/05_Clue.js --network rinkeby`
  //
  // to print out the clue.
  //
  // If the clue printed out is an empty string, then you have calculated an
  // incorrect storage slot. Try your calculation again.
  //
  // Once you've found the clue here, use this information and move on to
  // `scripts/06_DigForTreasure.js` to dig up the treasure!
  //

  // CACULATE THE STORAGE SLOT FROM THE PREVIOUS CLUE'S INFO
  const clueStorageSlot = '';
  const slotValue = await ethers.provider.getStorageAt(
    TREASURE_HUNT_CONTRACT_ADDR,
    clueStorageSlot
  );

  // UNPACK THE STORAGE SLOT BYTES FROM `slotValue` TO GET THE VALUE THE
  // PREVIOUS CLUE DESCRIBES
  const clue = '';

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

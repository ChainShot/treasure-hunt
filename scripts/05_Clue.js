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

  //
  // The clue from the previous step leads us to read the state variable `x`.
  //
  // By looking at the contract we can see that the variable `x` is stored
  // in slot 0x3. But we also know that the variable is byte-packed.
  //
  // In this step we focus not on calculating the storage variable, but on
  // extracting the value `x` from slot 3.
  //
  // The EVM will byte-pack variables into a slot in the order they are
  // declared starting from the right-hand of the slot, moving towards the
  // left. If we read slot 0x3 we will receive back the data:
  //
  //   0x00000000000000000000000000000000000000000000000000000000yyxxwwww
  //
  // where `wwww` contains the 2 byte hexadecimal value of `w`, `xx` the 1 byte
  // hexadecimal value of `x` and `yy` the 1 byte hexadecimal value of `y`.
  //
  // First we read the data from slot 3, then we convert the data to a
  // BigNumber and use BigNumber bitwise functions to unpack the data and
  // extract `x`.
  //
  const clueStorageSlot = '0x3';
  const slotValue = await ethers.provider.getStorageAt(
    TREASURE_HUNT_CONTRACT_ADDR,
    clueStorageSlot
  );

  const clue = ethers.BigNumber.from(slotValue).shr(16).mask(8).toNumber();

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

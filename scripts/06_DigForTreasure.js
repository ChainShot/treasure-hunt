require('dotenv').config();
const { ethers } = require('hardhat');

const TREASURE_HUNT_CONTRACT_ADDR = process.env.TREASURE_HUNT_CONTRACT_ADDR;

let treasureHunter;
let treasureHunterAddr;

async function main() {
  treasureHunter = ethers.provider.getSigner();
  treasureHunterAddr = await treasureHunter.getAddress();

  //
  // By golly, you've made it, now all need be done is a heave and a ho and a
  // dig, heave ho dig!
  //
  // Take the information from the previous clue and use it to dig for the
  // treasure! Set the `treasureLocation` variable in the code below to the
  // value you calculated in the previous step.
  //
  // Once you've done that, run this script with:
  //
  //   `npx hardhat run scripts/06_DigForTreasure.js --network rinkeby`
  //
  // to dig up the treasure and receive your reward!
  //
  // If you've dug for the treasure in the wrong location, try correcting your
  // calculation in `scripts/05_Clue.js` again and then return here to dig for
  // the treasure again.
  //
  const treasureLocation = 33;
  await digForTreasure(treasureLocation);
}

async function digForTreasure(treasureLocation) {
  const treasureHunt = await ethers.getContractAt(
    'TreasureHunt',
    TREASURE_HUNT_CONTRACT_ADDR,
    treasureHunter
  );

  const treasureFoundFilter =
    treasureHunt.filters.TreasureFound(treasureHunterAddr);
  const treasureNotFoundFilter =
    treasureHunt.filters.TreasureNotFound(treasureHunterAddr);

  const oldBalance = ethers.utils.formatEther(
    await ethers.provider.getBalance(treasureHunterAddr)
  );

  treasureHunt.on(treasureFoundFilter, async (addr, deed) => {
    console.log(
      `\nTreasure Hunter ${addr} has found the deed to the treasure! The deed reads:\n\n  ${deed}\n`
    );

    const newBalance = ethers.utils.formatEther(
      await ethers.provider.getBalance(addr)
    );

    console.log(`Treasure Hunter's original ETH balance = ${oldBalance}`);
    console.log(`Treasure Hunter's new ETH balance      = ${newBalance}`);
  });

  treasureHunt.on(treasureNotFoundFilter, (_, msg) => {
    console.log(`\n${msg}`);
  });

  const digForTreasureTxn = await treasureHunt.digForTreasure(
    treasureLocation.toString()
  );
  await digForTreasureTxn.wait();
}

main()
  .then(() =>
    setTimeout(() => {
      process.exit(0);
    }, 5000)
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

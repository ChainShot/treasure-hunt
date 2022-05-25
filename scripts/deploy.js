require('dotenv').config();

const { ethers } = require('hardhat');
const TreasureHuntArgs = require('./utils/treasure-hunt-args.js');

async function main() {
  const TreasureHunt = await ethers.getContractFactory('TreasureHunt');
  const treasureHunt = await TreasureHunt.deploy(
    TreasureHuntArgs[0],
    TreasureHuntArgs[1],
    TreasureHuntArgs[2],
    TreasureHuntArgs[3],
    TreasureHuntArgs[4],
    TreasureHuntArgs[5],
    TreasureHuntArgs[6],
    TreasureHuntArgs[7],
    TreasureHuntArgs[8],
    TreasureHuntArgs[9],
    {
      value: ethers.utils.parseEther(
        process.env.CONTRACT_FUNDING_AMOUNT_IN_ETH
      ),
    }
  );

  await treasureHunt.deployed();

  console.log(`TreasureHunt deployed to: ${treasureHunt.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

require('dotenv').config();
const { ethers } = require('hardhat');
const { getStringAt } = require('./utils/solidity-string-utils');

const TREASURE_HUNT_CONTRACT_ADDR = process.env.TREASURE_HUNT_CONTRACT_ADDR;

async function main() {
  //
  // storage slot 0x5
  // mapping (string => string) lastNameToFirst;
  //
  // keccak256(h(k) + p)
  //   keccak256(h("hite") + "5")
  //     keccak256("hite" + "5")
  //
  const keyAsBytes = ethers.utils.toUtf8Bytes('hite');
  const kb = new Uint8Array(...keyAsBytes, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0);
  console.log(`kb = ${JSON.stringify(kb)}`);
  // 68 (h), 69 (i), 74 (t), 65 (e)
  // const slot = ethers.utils.toUtf8Bytes(ethers.utils
  //   .hexZeroPad('0x5', 32)
  //   .slice(2));
  const slot = ethers.utils.hexZeroPad('0x5', 32).slice(2);
  const c = ethers.utils.toUtf8Bytes("hite" + slot);
  console.log({ c });

  // console.log(`0x5 padded = ${ethers.utils.hexZeroPad('0x5', 32)}`);
  // console.log({ slot });
  // const c = new Uint8Array([...keyAsBytes, 0x5]);
  // console.log({ c });

  const clueStorageSlot = ethers.utils.keccak256(c);
  const clue = await getStringAt(TREASURE_HUNT_CONTRACT_ADDR, clueStorageSlot);

  console.log({ clue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

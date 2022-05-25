const { ethers } = require('hardhat');

const utils = ethers.utils;

const BigNumber = ethers.BigNumber;
const MaxUint256 = ethers.constants.MaxUint256;
const firstByteMask = MaxUint256.sub(255);

const BYTES_PER_SLOT = 32;

function getShortString(storageSlotValue) {
  const storageSlotValueBN = BigNumber.from(storageSlotValue);

  const shortString = utils.toUtf8String(
    storageSlotValueBN.and(firstByteMask).toHexString()
  );

  return shortString;
}

async function getLongString(
  contractAddress,
  keccak256HashHexStringBaseStorageSlot,
  stringLength
) {
  const numSlotsToRead = Math.ceil(stringLength / BYTES_PER_SLOT);

  let storageSlot = BigNumber.from(
    keccak256HashHexStringBaseStorageSlot
  ).toHexString();

  let longString = '';

  for (let i = 0; i < numSlotsToRead; i++) {
    const bytes32String = await ethers.provider.getStorageAt(
      contractAddress,
      storageSlot
    );

    longString = longString.concat(utils.toUtf8String(bytes32String));

    storageSlot = BigNumber.from(storageSlot).add(1).toHexString();
  }

  return longString;
}

/*
  From: https://docs.soliditylang.org/en/v0.8.13/internals/layout_in_storage.html#bytes-and-string

  In particular: if the data is at most 31 bytes long, the elements are
  stored in the higher-order bytes (left aligned) and the lowest-order byte
  stores the value length * 2. For byte arrays that store data which is 32
  or more bytes long, the main slot p stores length * 2 + 1 and the data is
  stored as usual in keccak256(p). This means that you can distinguish a
  short array from a long array by checking if the lowest bit is set: short
  (not set) and long (set).

  If lowest bit set, string length in bytes: 

    (value_read_from_storage / 2) & 0x3

  Else string length in bytes:

    (value_read_from_storage / 2)
*/
function decodeStringLengthInBytes(hexString) {
  // check first bit not set to determine if this is a short string
  if (BigNumber.from(hexString).mask(1).eq(0)) {
    // if short string decode string length and strip off the upper 31 bytes
    return BigNumber.from(hexString).shr(1).mask(2).toNumber();
  }

  // otherwise this is a long string so decode string length and return
  return BigNumber.from(hexString).shr(1).toNumber();
}

async function getStringAt(contractAddress, hexStringStorageSlot) {
  const paddedHexStringStorageSlot = utils.hexZeroPad(hexStringStorageSlot, 32);

  const storageSlotValue = await ethers.provider.getStorageAt(
    contractAddress,
    paddedHexStringStorageSlot
  );

  const stringLength = decodeStringLengthInBytes(storageSlotValue);
  
  let str;

  if (stringLength > 31) {
    const stringBaseStorageSlot = utils.keccak256(paddedHexStringStorageSlot);
    str = await getLongString(contractAddress, stringBaseStorageSlot, stringLength);
  } else {
    str = getShortString(storageSlotValue);
  }

  return str.replace(/\x00/g, '');
}

exports.getStringAt = getStringAt;

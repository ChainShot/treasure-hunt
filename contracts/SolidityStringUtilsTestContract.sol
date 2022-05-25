// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SolidityStringUtilsTestContract
 {
    string public shortStringEmpty;             // storage slot 0x0
    string public shortString1Byte;             // storage slot 0x1
    string public shortString2Bytes;            // storage slot 0x2
    string public shortString31Bytes;           // storage slot 0x3
    string public shortStringWithNonLatinChar;  // storage slot 0x4
    string public longString32Bytes;            // storage slot 0x5
    string public longString3Slots;             // storage slot 0x6
    string public longStringWithNonLatinChar;   // storage slot 0x7
    string public longStringWithEmojis;         // storage slot 0x8

    constructor(
      string memory _shortStringEmpty,
      string memory _shortString1Byte,
      string memory _shortString2Bytes,
      string memory _shortString31Bytes,
      string memory _shortStringWithNonLatinChar,
      string memory _longString32Bytes,
      string memory _longString3Slots,
      string memory _longStringWithNonLatinChar,
      string memory _longStringWithEmojis
    ) {
        shortStringEmpty = _shortStringEmpty;
        shortString1Byte = _shortString1Byte;
        shortString2Bytes = _shortString2Bytes;
        shortString31Bytes = _shortString31Bytes;
        shortStringWithNonLatinChar = _shortStringWithNonLatinChar;
        longString32Bytes = _longString32Bytes;
        longString3Slots = _longString3Slots;
        longStringWithNonLatinChar = _longStringWithNonLatinChar;
        longStringWithEmojis = _longStringWithEmojis;
    }
}
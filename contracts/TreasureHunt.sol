// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract TreasureHunt {
    //
    // Note:
    //   `constants`, `events`, `structs` and user-defined `error`s do not
    //   use up contract storage slots
    //
    event TreasureFound(address indexed treasureHunter, string treasure);
    event TreasureNotFound(address indexed treasureHunter, string msg);

    string private constant treasureNotFoundMessage = "Alas, ye be digging in the wrong location matey. There ain't no treasure here. Ho, ho, ha, ha, ha!";
    string private constant trickyReentrantPirateMessage = "What shenanigans ye be pulling matey? Ye think pirates don't know about reentrancy eh? Thieves we be and thieves we know how to snuff out.";

    // storage slot 0x0
    string private startHere;

    // storage slot 0x1
    mapping(bytes32 => string) private iceWallGuardTowers;

    // storage slot 0x2
    string[] private hallOfNumberedDoors;

    // storage slot 0x3
    uint16 private w;    // byte-packed into storage slot 3
    uint8 private x;     // byte-packed into storage slot 3
    uint8 private y;     // byte-packed into storage slot 3

    struct LockerContents {
        uint256 goldCoins;
        string flaskOfRum;
        string pairOfBoots;
    }

    // storage slot 0x4
    LockerContents[] private shipmatesLockers;

    // storage slot 0x5
    uint256 treasureAmountInEth;

    // storage slot 0x6
    bool entered;

    constructor(
        string memory _firstClue, string memory _secondClue,
        string memory _thirdClue, string memory _fourthClue,
        uint8 _w, uint8 _x, uint8 _y, string memory _treasureLocation,
        string memory _treasure, uint256 _treasureAmountInEth) payable {

        startHere = _firstClue;

        for (uint i = 0; i < 10; i++) {
            if (i == 2) {
                hallOfNumberedDoors.push(_secondClue);
            } else {
                hallOfNumberedDoors.push("");
            }
        }

        iceWallGuardTowers[bytes32(uint256(4))] = _thirdClue;

        w = _w;
        x = _x;
        y = _y;

        shipmatesLockers.push(LockerContents(80211, "Hands off my whiskey! Yours truly, the First Mate.", "The First Mate's shiny boots"));
        shipmatesLockers.push(LockerContents(965, _fourthClue, "Looking in the Second Mate's shoes are ye? Pirates never hide anything in their shoes."));
        shipmatesLockers.push(LockerContents(2, "The Third Mate cannot afford a belt! Move along.", "The Third Mate's torn shoes. Move on."));

        storeString(_treasureLocation, _treasure);

        treasureAmountInEth = _treasureAmountInEth;
    }

    modifier nonReentrant() {
        require(!entered, trickyReentrantPirateMessage);
        entered = true;
        _;
        entered = false;
    }

    function digForTreasure(string memory treasureLocation) external nonReentrant {
        string memory treasure = loadString(treasureLocation);

        if (bytes(treasure).length == 0) {
            emit TreasureNotFound(msg.sender, treasureNotFoundMessage);
            return;
        }

        (bool success,) = payable(msg.sender).call{value: treasureAmountInEth}("");
        require(success, "Arg...transfer of treasure unsuccessful. Us pirates ain't so good ain't programmming.");

        emit TreasureFound(msg.sender, treasure);
    } 

    // https://ethereum.stackexchange.com/questions/126269/how-to-store-and-retrieve-string-which-is-more-than-32-bytesor-could-be-less-th
    function storeString(string memory location, string memory str) private {
        bytes32 lengthSlot = keccak256(abi.encodePacked(location));
        bytes32 dataSlot = keccak256(abi.encodePacked(lengthSlot));

        assembly {
            let stringLength := mload(str)

            switch gt(stringLength, 0x19)

            // If string length <= 31 we store a short array
            // length storage variable layout : 
            // bytes 0 - 31 : string data
            // byte 32 : length * 2
            // data storage variable is UNUSED in this case
            case 0x00 {
                sstore(lengthSlot, or(mload(add(str, 0x20)), mul(stringLength, 2)))
            }

            // If string length > 31 we store a long array
            // length storage variable layout :
            // bytes 0 - 32 : length * 2 + 1
            // data storage layout :
            // bytes 0 - 32 : string data
            // If more than 32 bytes are required for the string we write them
            // to the slot(s) following the slot of the data storage variable
            case 0x01 {
                 // Store length * 2 + 1 at slot length
                sstore(lengthSlot, add(mul(stringLength, 2), 1))

                // Then store the string content by blocks of 32 bytes
                for {let i:= 0} lt(mul(i, 0x20), stringLength) {i := add(i, 0x01)} {
                    sstore(add(dataSlot, i), mload(add(str, mul(add(i, 1), 0x20))))
                }
            }
        }
    }

    // https://ethereum.stackexchange.com/questions/126269/how-to-store-and-retrieve-string-which-is-more-than-32-bytesor-could-be-less-th
    function loadString(string memory location) private view returns (string memory str) {
        bytes32 lengthSlot = keccak256(abi.encodePacked(location));
        bytes32 dataSlot = keccak256(abi.encodePacked(lengthSlot));

        assembly {
            let stringLength := sload(lengthSlot)

            // Check if what type of array we are dealing with
            // The return array will need to be taken from STORAGE
            // respecting the STORAGE layout of string, but rebuilt
            // in MEMORY according to the MEMORY layout of string.
            switch and(stringLength, 0x01)

            // Short array
            case 0x00 {
                let decodedStringLength := div(and(stringLength, 0xFF), 2)

                // Add length in first 32 byte slot 
                mstore(str, decodedStringLength)
                mstore(add(str, 0x20), and(stringLength, not(0xFF)))
                mstore(0x40, add(str, 0x40))
            }

            // Long array
            case 0x01 {
                let decodedStringLength := div(stringLength, 2)
                let i := 0

                mstore(str, decodedStringLength)
                
                // Write to memory as many blocks of 32 bytes as necessary taken from data storage variable slot + i
                for {} lt(mul(i, 0x20), decodedStringLength) {i := add(i, 0x01)} {
                    mstore(add(add(str, 0x20), mul(i, 0x20)), sload(add(dataSlot, i)))
                }

                mstore(0x40, add(str, add(0x20, mul(i, 0x20))))
            }
        }
    }
}
# The Great Solidity Storage Layout Treasure Hunt

* [Introduction](#introduction)
* [Storage Layout](#storage-layout)
  * [Value and Reference Type Storage Variables](#value-and-reference-type-storage-variables)
    * [Value Type Variables](#value-type-variables)
      * [Byte Packing](#byte-packing)
    * [Reference Type Variables](#reference-type-variables)
      * [Arrays](#arrays)
      * [Mappings](#mappings)
      * [Bytes and Strings](#bytes-and-strings)
* [Finding the Treasure](#finding-the-treasure)

## Introduction
Ahoy Mateys,

Blimey me! I hear ye be looking for unfound treasures in the deeps of the vast ocean of Solidity's treasure maps. Well, ye've come to the right place to begin a treasure hunt, ye budding Solidity pirates.

Most call me Captain Keccak, and avast ye, ye best call me that too! The last pirate who did not heed this, Captain Hook, lost his hand to a friend of mine. Savvy?

Excellent!

Let me be the first to welcome ye to the Treasure Hunt game. I, your trusted pirate captain, will be your guide along the way.

Solidity's treasure maps are vast. Indeed, these maps are larger than maps of all the stars in the observable universe. These maps are so large that only a few pirates have e'er uncovered even a single treasure hidden within them.

Ye, being a pirate and all, let me transate some pirate terminology to land lubber speak (also known as geek speak)...

Treasure maps are written on scrolls of paper. In geek speak, you can think of a scroll as a Solidity Contract. Treasure maps are written upon these scrolls. For treasure hunting purposes you can think of a treasure map as the Storage Layout of a Solidity Contract.

Each contract's Storage Layout has an astronomical amount of different locations where treasure hunt clues and/or treasures can be buried. I, Captain Keccak, am a pirate and am no mathematician nor writer to be sure. But let me share with ye budding pirates some things that one great sage once explained to me...

## Storage Layout
_If you're already a storage layout expert jump on down to the [Finding the Treasure](#finding-the-treasure) section of this README and start your treasure hunt without further ado! Otherwise read on._

**A contract's storage layout contains `2^256` storage slots and each storage slot contains 32 bytes of data.**

`2^256` equates to `10^77` storage slots. Compare that to the number of stars in the observable universe which is estimated to be between `10^22` and `10^24` stars. **Sink me! No wonder so few treasures have e'er been found.**

The details of storage layout in Solidity can be found in the [Solidity Storage Layout Docs](https://docs.soliditylang.org/en/v0.8.13/internals/layout_in_storage.html) and it's definitely a must-read if you intend to find any treasures here.

But to speed you along your way, this much can be said here...

When variables are declared in a smart contract, they are assigned a storage slot in the order in which they are declared in the contract. For example:

```solidity
contract CaptainHook {
  // storage slot 0x0
  uint256 private ageInYears = 320;

  // storage slot 0x1
  address[] private crewMemberAddresses;

  // storage slot 0x2
  mapping (address => uint256) private crewMemberNumGoldCoins;

  // storage slot 0x3
  uint8 private numHands = 1;     // byte-packed into slot 3
  uint16 private numFriends = 0;  // byte-packed into slot 3
  uint8 private numEyes = 2;      // byte-packed into slot 3

  // storage slot 0x4
  string private fullName = "Captain James Bartholemew Hook";
}
```

The value of the state variable `ageInYears` is stored in slot `0x0` because it is the first declared state variable. The array `crewMemberAddresses` is stored in slot `0x1` because it is the second declared state variable, and so on.

Note that declarations of `constant` variables, `event`s, and `struct` and `error` types have no impact on storage layout as they do not use storage slots.

### Value and Reference Type Storage Variables
In Solidity, there are generally 2 types of variables: **Value Types** and **Reference Types**. Value type variables are variables that have a fixed size at compile time (aka statically-sized) and never change in size. `uint256`, `int8`, and `bool` are just a few examples of value type variables. Reference type variables have dynamic sizes that can change over time. Dynamic arrays like `uint256[]` and `mappings` are examples of reference type variables.

### Value Type Variables

**For 32-byte value type variables, the storage slot of the variable contains the variable's value. It's as simple as that.**

#### Byte Packing

When value type storage variables are declared consecutively in a contract, if some or all of the consecutive value type variables can be fit into a single 32 byte slot, then Solidity will 'byte-pack' the variables into the same storage slot to save on storage space.

For example, in the CaptainHook contract above, 3 consecutive state variables of type `uint8`, `uint16` and `uint8` are declared: `numHands`, `numFriends`, `numEyes`. Because these 3 variables can collectively all fit into 32 bytes of storage the Solidity compiler and EVM will byte-pack these variables into the same storage slot.

The EVM will byte-pack variables into a slot in the order they are declared starting from the right-hand of the slot, moving towards the left. If we read slot `0x3` we will receive back the data:

    0x00000000000000000000000000000000000000000000000000000000eeffffhh

_NOTE: the value above only shows packed variable layout symbolically and is not an actual valid hexadecimal value_

`hh` contains the 1 byte hexadecimal value of `numHands`, `ffff` the 2 byte hexadecimal value of `numFriends` and `ee` the 1 byte hexadecimal value of `numEyes`.

To read `numFriends` from storage slot 3 not only does the storage slot need to be loaded, but the value also first needs to be bit shifted by 1 byte to the right. And finally, the `numEyes` variable needs to be masked off (bitwise AND'ed with `0xffff`) giving us only the value of `numFriends`. To read the value `numHands` all other data than the first byte needs to be masked off (bitwise AND'ed with `0xff`).

Byte-packing can be good for optimizing on storage gas costs, but reading byte-packed variables from storage will cost extra gas when the values need to be read because the EVM will need to:
1. read the value from the correct storage slot; and
2. bit-shift and bit-mask the slot value to extract the value of the variable

When defining contracts and their state variables you'll need to think carefully about how your contract's data will be used and the best way to layout the state variables to minimize gas costs for the specific business cases you are implementing.

### Reference Type Variables

#### Arrays
For array reference types the storage slot of the variable marks the array variable's existence. Additionally, the length of the array is also stored in the array's marker storage slot.

If an array's marker slot is storage slot `p`, then reading the value directly from the marker storage slot `p` will return the array's length. But the actual data of the array will be stored starting at storage slot `keccak256(p)`.

In the example contract above the array variable `crewMemberAddresses` marker slot is `0x1`. If we read the data from this storage slot, `0x1`, we will get the length of the array, but the actual data in the array begins at the keccak256 hash of the marker storage slot. In other words, reading from storage slot `keccak256(0x1)` would be the equivalent of reading the value `crewMemberAddresses[0]`.

To read an array element at index 1 of an array, for example to read `crewMemberAddresses[1]`, we would read from the storage slot `keccak256(0x1) + 1`, and so on...

Here is example JS code using `ethers.js` that calculates the array's data storage slots for `crewMemberAddresses[0]` and `crewMemberAddresses[1]`:

```javascript
const index0StorageSlot = ethers.utils.keccak256(ethers.utils.hexZeroPad('0x1', 32));
const index1StorageSlot =
    ethers.BigNumber.from(dataArrayIndex0StorageSlot).add(1).toHexString();
```

#### Mappings
For mapping reference types the storage slot of the variable marks the mapping variable's existence. For mappings, no additional information is stored in marker storage slot. For example, in the example contract above the mapping variable `crewMemberNumGoldCoins` marker slot is `0x2`. If we read the data from this storage slot we will get `0`, unlike arrays where the array length is returned returned.

To get the actual data of the map values for given keys we need to use a combination of the map's marker slot `p` and a map key `k` that we want to get the value for.

The storage slot for key `k` would be `keccak256(h(k) . p)` where:
* `k` is the key into the mapping
* `h()` is a function that pads the value `k` to 32 bytes
* `p` is value of the marker storage slot
* `.` means to concatenate `h(k)` and `p`

If we have a crew member with address `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` and we want to find that crew member's number of gold coins, we first need to calculate the storage slot for this key in the `crewMemberNumGoldCoins` mapping.

Solidity addresses are 20 bytes long and because the `crewMemberNumGoldCoins` is a mapping that maps `address` keys to `uint256` values, to read value `crewMemberNumGoldCoins[0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266]` the storage slot of this would be calculated as:

```
keccak256('0x000000000000000000000000f39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    + '0000000000000000000000000000000000000000000000000000000000000002')
```

From the example contract above the mapping variable `crewMemberNumGoldCoins` marker slot is `0x2`. Using `ethers.js` to calculate the storage slot for `crewMemberNumGoldCoins[0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266]` we have:

```javascript
const crewMemberNumGoldCoinsKey =
    ethers.utils.hexZeroPad('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 32);
const crewMemberNumGoldCoinsMarkerSlot = ethers.utils.hexZeroPad('0x2', 32);

const storageSlot = ethers.utils.keccak256(
    crewMemberNumGoldCoinsKey + crewMemberNumGoldCoinsMarkerSlot.slice(2)
);
```

#### Bytes and Strings
`bytes` and `string` types are dynamic types and are encoded identically. In general, their encoding is similar to `bytes1[]`, in the sense that there is a slot for the array itself and a data area that is computed using a keccak256 hash of that slot’s position. However, for short values (shorter than 32 bytes) the array elements are stored together with the length in the same slot.

You can read more about the details of this in [Solidity's Storage Layout Section on Bytes and Strings](https://docs.soliditylang.org/en/v0.8.14/internals/layout_in_storage.html#bytes-and-string)

## Finding the Treasure!

The treasure map for this treasure is old, and due to its age it's a bit murky and obscured, but this much can be made out - the map's storage layout can still be read.

```solidity
contract TreasureHunt {
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
}
```
To find the treasure use the `TreasureHunt` contract's storage layout above as a reference.

Then follow the steps below to study the clues and make your way to the treasure:
1. Pull down the repo: `git clone git@github.com:ChainShot/treasure-hunt.git`
2. `cd` into the base directory of the cloned repo
3. Create an `.env` file and add the following variables to it:
```
RINKEBY_URL=<YOUR_RINKEBY_JSON_RPC_URL>
PRIVATE_KEY=<YOUR_RINKEBY_TEST_ACCOUNT_PRIVATE_KEY_WITH_SOME_ETH>
TREASURE_HUNT_CONTRACT_ADDR=<TREASURE_HUNT_CONTRACT_ADDR_ON_RINKEBY>
```
4. Start in the [01_StartHere.js](https://github.com/ChainShot/treasure-hunt/blob/main/scripts/01_StartHere.js) file and follow the instructions in the comments.
5. This and other files use a utility method `getStringAt()` which works just like `ethers.provider.getStorageAt()`, except `getStringAt()` returns strings, not hexadecimal values.
6. Start the hunt for the treasure by running `npx hardhat run scripts/01_StartHere.js --network rinkeby` to get your first clue. After you find the first clue move on to [02_Clue.js](https://github.com/ChainShot/treasure-hunt/blob/main/scripts/02_Clue.js) to find the next clue and so on.

Each clue you uncover will lead you to the location of the next clue. Using each clue, you'll need to calculate the storage slot of each subsequent clue until you finally find the treasure.

Good luck proving your stuff as a true pirate matey! Your success will be duly rewarded!



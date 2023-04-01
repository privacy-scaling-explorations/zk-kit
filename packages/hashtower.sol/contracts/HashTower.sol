// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT5} from "poseidon-solidity/PoseidonT5.sol";

uint256 constant H = 24;
uint256 constant W = 4;

uint256 constant bitsPerLevel = 4;
// (1 << bitsPerLevel) - 1
uint256 constant levelBitmask = 15;

// Each HashTower has certain properties and data that will
// be used to add new items.
struct HashTowerData {
    // max H = 64
    // store the number of items in each level as 4 bit chunks in this
    uint256 levelCounts;
    mapping(uint256 => uint256) items;
    uint256[H][W] levels;
    uint256[H] levelDigests;
    uint256 root;
    uint256 R;
}

/// @title HashTower.
/// @dev The HashTower allows to calculate the digest of digests each time an item is added, ensuring
/// the integrity of the HashTower.
library HashTower {
    uint256 internal constant EMPTY_LEVEL_HASH =
        2351654555892372227640888372176282444150254868378439619268573230312091195718;
    uint256 internal constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    event Add(uint256 value, uint256 root);

    function digest(HashTowerData storage self) internal returns (uint256) {
        uint256 levelCounts = self.levelCounts;
        uint256 R = self.R;
        uint256 _digest = 0;
        for (uint8 x = 0; x < H; x++) {
            uint8 levelCount = itemsInLevel(x, levelCounts);
            uint256 levelDigest = levelCount == 0 ? EMPTY_LEVEL_HASH : self.levelDigests[x];
            uint256 m = mulmod(R, levelDigest, SNARK_SCALAR_FIELD);
            _digest = addmod(_digest, m, SNARK_SCALAR_FIELD);
            R = mulmod(R, R, SNARK_SCALAR_FIELD);
        }
        self.root = _digest;
        return _digest;
    }

    // decode the number of items in the target level
    function itemsInLevel(uint8 level, uint256 levelCounts) internal pure returns (uint8) {
        return uint8((levelCounts >> (level * bitsPerLevel)) & levelBitmask);
    }

    // encode a new number of items in the levelCounts variable
    function updateItemsInLevel(
        uint8 level,
        uint8 newCount,
        uint256 levelCounts
    ) internal pure returns (uint256) {
        uint256 zeroed = levelCounts & ~(levelBitmask << (uint256(level) * bitsPerLevel));
        require(newCount <= W, "levelcount");
        return zeroed + (uint256(newCount) << (uint256(level) * bitsPerLevel));
    }

    /// @dev Add an item.
    /// @param self: HashTower data
    /// @param item: item to be added
    function add(HashTowerData storage self, uint256 item) public returns (uint256) {
        require(item < SNARK_SCALAR_FIELD, "HashTower: item must be < SNARK_SCALAR_FIELD");

        uint256 newR = uint256(
            keccak256(
                abi.encodePacked(
                    self.R,
                    item /*, block.prevrandao*/
                )
            )
        ) % SNARK_SCALAR_FIELD;
        self.R = newR;

        // purely mathematical function to determine what level a new item goes in
        // based on the number of items
        //
        // OR just store all levels in a uint256 lmao
        uint256 levelCounts = self.levelCounts;

        uint8 itemsInFirstLevel = itemsInLevel(0, levelCounts);
        if (itemsInFirstLevel == W) {
            revert("full");
        }

        self.levels[0][itemsInFirstLevel] = item;
        itemsInFirstLevel += 1;
        levelCounts = updateItemsInLevel(0, itemsInFirstLevel, levelCounts);

        {
            uint256[W] memory items;
            for (uint8 x = 0; x < W; x++) {
                if (x < itemsInFirstLevel) {
                    items[x] = self.levels[0][x];
                } else {
                    items[x] = 0;
                }
            }
            self.levelDigests[0] = PoseidonT5.hash(items);
        }

        // if the first level isn't full just break
        if (itemsInFirstLevel < W) {
            self.levelCounts = levelCounts;
            uint256 _root = digest(self);
            emit Add(item, _root);
            return _root;
        }

        // otherwise start moving up the tree

        for (uint8 x = 1; x < H; x++) {
            // determine the number of items in each level
            uint8 _itemsInLevel = itemsInLevel(x, levelCounts);
            self.levels[x][_itemsInLevel] = self.levelDigests[x - 1];
            _itemsInLevel++;
            // don't need to set the digest because itemsInLevel is 0
            // self.levelDigests[x-1] = 0;
            levelCounts = updateItemsInLevel(x - 1, 0, levelCounts);
            uint256[W] memory items;
            for (uint8 y = 0; y < W; y++) {
                if (y < _itemsInLevel) {
                    items[y] = self.levels[x][y];
                } else {
                    items[y] = 0;
                }
            }
            self.levelDigests[x] = PoseidonT5.hash(items);
            if (_itemsInLevel < W) {
                levelCounts = updateItemsInLevel(x, _itemsInLevel, levelCounts);
                break;
            } else if (x == H - 1) {
                levelCounts = updateItemsInLevel(x, _itemsInLevel, levelCounts);
            }
        }
        self.levelCounts = levelCounts;
        uint256 __root = digest(self);
        emit Add(item, __root);
        return __root;
    }
}

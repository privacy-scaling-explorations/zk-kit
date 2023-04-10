// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT3} from "poseidon-solidity/PoseidonT3.sol";
// CAPACITY = W * (W**0 + W**1 + ... + W**(H - 1)) = W * (W**H - 1) / (W - 1)
// 4 * (4**24 - 1) / (4 - 1) = 375_299_968_947_540;
uint256 constant H = 24;
uint256 constant W = 4;

uint256 constant bitsPerLevel = 4;
uint256 constant levelBitmask = 15; // (1 << bitsPerLevel) - 1
uint256 constant ones = 0x111111111111111111111111; // H ones

// Each HashTower has certain properties and data that will
// be used to add new items.
struct HashTowerData {
    uint256 levelCounts; // count of each level
    uint256[H] digests; // digest of each level
    uint256[H] digestOfDigests; // digest of digests
}

/// @title HashTower.
/// @dev The HashTower allows to calculate the digest of digests each time an item is added, ensuring
/// the integrity of the HashTower.
library HashTower {
    uint256 internal constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    /// @dev Add an item.
    /// @param self: HashTower data
    /// @param item: item to be added
    function add(HashTowerData storage self, uint256 item) public {
        require(item < SNARK_SCALAR_FIELD, "HashTower: item must be < SNARK_SCALAR_FIELD");

        uint256 levelCounts = self.levelCounts;
        uint256 levelCount;
        uint256 level;
        uint256 digest;
        uint256 digestOfDigests;
        uint256 toAdd;

        // find the lowest non-full level and its levelCount
        while (true) {
            levelCount = levelCounts & levelBitmask;
            if (levelCount < W) break;
            level++;
            levelCounts >>= 4;
        }
        {
            // update the new levelCounts
            uint256 fullLevelBits = level * bitsPerLevel;
            uint256 onesMask = ((1 << (fullLevelBits + bitsPerLevel)) - 1);
            self.levelCounts = (levelCounts << fullLevelBits) + (onesMask & ones);
        }

        // append at the level
        if (level > 0) {
            toAdd = self.digests[level - 1];
        } else {
            toAdd = item;
        }

        if (levelCount == 0) {
            digest = toAdd; // the first one
        } else {
            digest = PoseidonT3.hash([self.digests[level], toAdd]);
        }

        if ((levelCounts >> 4) == 0) {
            digestOfDigests = digest; // there is no level above
        } else {
            digestOfDigests = PoseidonT3.hash([self.digestOfDigests[level + 1], digest]);
        }
        self.digests[level] = digest;
        self.digestOfDigests[level] = digestOfDigests;

        // the rest of levels are all full
        while (level != 0) {
            level--;

            if (level == 0) {
                toAdd = item;
            } else {
                toAdd = self.digests[level - 1];
            }

            digest = toAdd;
            digestOfDigests = PoseidonT3.hash([digestOfDigests, digest]); // top-down
            self.digests[level] = digest;
            self.digestOfDigests[level] = digestOfDigests;
        }
    }

    function getDataForProving(HashTowerData storage self)
        external
        view
        returns (
            uint256,
            uint256[] memory,
            uint256
        )
    {
        uint256 len = self.digests.length;
        uint256[] memory digests = new uint256[](len); // for returning a dynamic array
        for (uint256 i = 0; i < len; i++) {
            digests[i] = self.digests[i];
        }
        return (self.levelCounts, digests, self.digestOfDigests[0]);
    }
}

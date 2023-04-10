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
struct HashTowerHashChainData {
    uint256 levelLengths; // length of each level
    uint256[H] digests; // digest of each level
    uint256[H] digestOfDigests; // digest of digests
}

/// @title HashTower.
/// @dev The HashTower allows to calculate the digest of digests each time an item is added, ensuring
/// the integrity of the HashTower.
library HashTowerHashChain {
    uint256 internal constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    function findLowestNonFullLevelThenInc(uint256 levelLengths)
        internal
        pure
        returns (
            uint256 level,
            bool isHead,
            bool isTop,
            uint256 newLevelLengths
        )
    {
        uint256 levelLength;
        while (true) {
            levelLength = levelLengths & levelBitmask;
            if (levelLength < W) break;
            level++;
            levelLengths >>= bitsPerLevel;
        }

        isHead = (levelLength == 0);
        isTop = ((levelLengths >> bitsPerLevel) == 0);

        uint256 fullLevelBits = level * bitsPerLevel;
        uint256 onesMask = ((1 << (fullLevelBits + bitsPerLevel)) - 1);
        newLevelLengths = (levelLengths << fullLevelBits) + (onesMask & ones);
    }

    /// @dev Add an item.
    /// @param self: HashTower data
    /// @param item: item to be added
    function add(HashTowerHashChainData storage self, uint256 item) public {
        require(item < SNARK_SCALAR_FIELD, "HashTower: item must be < SNARK_SCALAR_FIELD");

        uint256 level;
        bool isHead;
        bool isTop;
        (level, isHead, isTop, self.levelLengths) = findLowestNonFullLevelThenInc(self.levelLengths);

        uint256 digest;
        uint256 digestOfDigests;
        uint256 toAdd;

        // append at the level
        toAdd = (level == 0) ? item : self.digests[level - 1];
        digest = isHead ? toAdd : PoseidonT3.hash([self.digests[level], toAdd]);
        digestOfDigests = isTop ? digest : PoseidonT3.hash([self.digestOfDigests[level + 1], digest]);
        self.digests[level] = digest;
        self.digestOfDigests[level] = digestOfDigests;

        // the rest of levels are all full
        while (level != 0) {
            level--;

            toAdd = (level == 0) ? item : self.digests[level - 1];
            digest = toAdd;
            digestOfDigests = PoseidonT3.hash([digestOfDigests, digest]); // top-down
            self.digests[level] = digest;
            self.digestOfDigests[level] = digestOfDigests;
        }
    }

    function getDataForProving(HashTowerHashChainData storage self)
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
        return (self.levelLengths, digests, self.digestOfDigests[0]);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT3} from "poseidon-solidity/PoseidonT3.sol";

// CAPACITY = W * (W**0 + W**1 + ... + W**(H - 1)) = W * (W**H - 1) / (W - 1)
uint256 constant H = 24;
uint256 constant W = 4;
uint256 constant CAPACITY = 375_299_968_947_540;

// Each HashTower has certain properties and data that will
// be used to add new items.
struct HashTowerData {
    uint256 countOfItems; // count of items being added
    uint256[H] digests; // digest of each level
    uint256[H] digestOfDigests; // digest of digests
}

/// @title HashTower.
/// @dev The HashTower allows to calculate the digest of digests each time an item is added, ensuring
/// the integrity of the HashTower.
library HashTower {
    uint256 internal constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    event Add(uint8 indexed level, uint64 indexed lvFullIndex, uint256 value);

    /// @dev Add an item.
    /// @param self: HashTower data
    /// @param item: item to be added
    function add(HashTowerData storage self, uint256 item) public {
        require(item < SNARK_SCALAR_FIELD, "HashTower: item must be < SNARK_SCALAR_FIELD");

        uint256 count = self.countOfItems;
        uint256 level;
        uint256 powerOfW = 1; // W ** level
        uint256 leadingZeros = 1; // W**0 + W**1 + W**2 + ...
        uint256 fullLevelLength;
        uint256 levelLength;
        uint256 digest;
        uint256 digestOfDigests;
        uint256 toAdd;

        // find the lowest level that has space
        while (true) {
            if (count < leadingZeros) {
                fullLevelLength = 0;
                levelLength = 0;
                break;
            } else {
                fullLevelLength = (count - leadingZeros) / powerOfW + 1;
                levelLength = ((fullLevelLength - 1) % W) + 1;
                if (levelLength != W) break; // most of the time
            }
            level++;
            powerOfW *= W;
            leadingZeros += powerOfW;
        }

        // append at the level
        if (level > 0) {
            toAdd = self.digests[level - 1];
        } else {
            toAdd = item;
        }
        emit Add(uint8(level), uint64(fullLevelLength), toAdd);

        if (levelLength == 0) {
            digest = toAdd; // the first one
        } else {
            digest = PoseidonT3.hash([self.digests[level], toAdd]);
        }

        if (fullLevelLength == levelLength) {
            digestOfDigests = digest; // there is no level above
        } else {
            digestOfDigests = PoseidonT3.hash([self.digestOfDigests[level + 1], digest]);
        }

        // then go downward
        uint256 prevDd;
        while (true) {
            self.digests[level] = digest;
            self.digestOfDigests[level] = digestOfDigests;

            if (level == 0) break;
            leadingZeros -= powerOfW;
            prevDd = digestOfDigests;
            level--;
            powerOfW /= W;
            // the rest levels are all full
            fullLevelLength = (count - leadingZeros) / powerOfW + 1;
            if (level > 0) {
                toAdd = self.digests[level - 1];
            } else {
                toAdd = item;
            }
            emit Add(uint8(level), uint64(fullLevelLength), toAdd);
            digest = toAdd;
            digestOfDigests = PoseidonT3.hash([prevDd, digest]);
        }
        self.countOfItems = count + 1;
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
        return (self.countOfItems, digests, self.digestOfDigests[0]);
    }
}

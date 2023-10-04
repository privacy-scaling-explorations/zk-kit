// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../QuinIMT.sol";

contract QuinIMTTest {
    QuinIMTData public data;

    function init(uint256 depth) external {
        QuinIMT.init(data, depth, 0);
    }

    function insert(uint256 leaf) external {
        QuinIMT.insert(data, leaf);
    }

    function update(
        uint256 leaf,
        uint256 newLeaf,
        uint256[4][] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external {
        QuinIMT.update(data, leaf, newLeaf, proofSiblings, proofPathIndices);
    }

    function remove(
        uint256 leaf,
        uint256[4][] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external {
        QuinIMT.remove(data, leaf, proofSiblings, proofPathIndices);
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../LazyMerkleTree.sol";

contract LazyMerkleTreeTest {
    LazyTreeData public data;

    function init(uint8 depth) public {
        LazyMerkleTree.init(data, depth);
    }

    function reset() public {
        LazyMerkleTree.reset(data);
    }

    function insert(uint256 leaf) public {
        LazyMerkleTree.insert(data, leaf);
    }

    function update(uint256 leaf, uint40 index) public {
        LazyMerkleTree.update(data, leaf, index);
    }

    // for benchmarking the root cost
    function benchmarkRoot() public {
        LazyMerkleTree.root(data);
    }

    function root() public view returns (uint256) {
        return LazyMerkleTree.root(data);
    }
}

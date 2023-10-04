// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../LazyIMT.sol";

contract LazyIMTTest {
    LazyIMTData public data;

    function init(uint8 depth) public {
        LazyIMT.init(data, depth);
    }

    function reset() public {
        LazyIMT.reset(data);
    }

    function insert(uint256 leaf) public {
        LazyIMT.insert(data, leaf);
    }

    function update(uint256 leaf, uint40 index) public {
        LazyIMT.update(data, leaf, index);
    }

    function root() public view returns (uint256) {
        return LazyIMT.root(data);
    }
}
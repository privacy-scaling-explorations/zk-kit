// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../HashTower.sol";

contract HashTowerTest {
    using HashTower for HashTowerData;

    // HashTower may emit multiple events in a singal add() call
    event Add(uint8 indexed level, uint64 indexed lvFullIndex, uint256 value);

    // map for multiple test cases
    mapping(bytes32 => HashTowerData) public towers;

    function add(bytes32 _towerId, uint256 _item) external {
        towers[_towerId].add(_item);
    }

    function getDataForProving(bytes32 _towerId)
        external
        view
        returns (
            uint256,
            uint256[] memory,
            uint256
        )
    {
        return towers[_towerId].getDataForProving();
    }
}

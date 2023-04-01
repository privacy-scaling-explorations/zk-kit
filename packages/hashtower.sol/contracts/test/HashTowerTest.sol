// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../HashTower.sol";

contract HashTowerTest {
    using HashTower for HashTowerData;

    // HashTower may emit multiple events in a singal add() call
    event Add(uint256 value);

    // map for multiple test cases
    mapping(bytes32 => HashTowerData) public towers;

    function add(bytes32 _towerId, uint256 _item) external {
        towers[_towerId].add(_item);
    }

    function addBenchmark(bytes32 _towerId, uint256 _item) external returns (uint256) {
        uint256 g = gasleft();
        towers[_towerId].add(_item);
        g = g - gasleft();
        return g;
    }

    function root(bytes32 _towerId) public view returns (uint256) {
        return towers[_towerId].root;
    }
}

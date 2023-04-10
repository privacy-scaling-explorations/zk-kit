// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../HashTowerHashChain.sol";

contract HashTowerHashChainTest {
    using HashTowerHashChain for HashTowerHashChainData;

    // HashTower may emit multiple events in a singal add() call
    event Add(uint256 item);

    // map for multiple test cases
    mapping(bytes32 => HashTowerHashChainData) public towers;

    function add(bytes32 _towerId, uint256 _item) external {
        towers[_towerId].add(_item);
        emit Add(_item);
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

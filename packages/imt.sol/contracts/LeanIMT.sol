// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT3} from "poseidon-solidity/PoseidonT3.sol";

struct LeanIMTData {
    uint256 size;
    uint256 depth;
    mapping(uint256 => uint256) rightmostNodes;
    mapping(uint256 => uint256) leaves;
}

error WrongSiblingNodes();
error LeafGreaterThanSnarkScalarField();
error LeafCannotBeZero();
error LeafAlreadyExists();
error LeafDoesNotExist();

library LeanIMT {
    uint256 public constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    function insert(LeanIMTData storage self, uint256 leaf) public returns (uint256) {
        if (leaf >= SNARK_SCALAR_FIELD) {
            revert LeafGreaterThanSnarkScalarField();
        } else if (leaf == 0) {
            revert LeafCannotBeZero();
        } else if (has(self, leaf)) {
            revert LeafAlreadyExists();
        }

        while (2 ** self.depth < self.size + 1) {
            self.depth += 1;
        }

        uint256 index = self.size;
        uint256 node = leaf;

        for (uint256 level = 0; level < self.depth; ) {
            if ((index >> level) & 1 == 1) {
                node = PoseidonT3.hash([self.rightmostNodes[level], node]);
            } else {
                self.rightmostNodes[level] = node;
            }

            unchecked {
                ++level;
            }
        }

        self.size += 1;

        self.rightmostNodes[self.depth] = node;
        self.leaves[leaf] = self.size;

        return node;
    }

    function update(
        LeanIMTData storage self,
        uint256 oldLeaf,
        uint256 newLeaf,
        uint256[] calldata siblingNodes
    ) public returns (uint256) {
        if (newLeaf >= SNARK_SCALAR_FIELD) {
            revert LeafGreaterThanSnarkScalarField();
        } else if (!has(self, oldLeaf)) {
            revert LeafDoesNotExist();
        } else if (newLeaf != 0 && has(self, newLeaf)) {
            revert LeafAlreadyExists();
        }

        uint256 index = indexOf(self, oldLeaf);
        uint256 node = newLeaf;
        uint256 oldRoot = oldLeaf;

        uint256 s = 0;

        // The number of siblings of a proof can be less than
        // the depth of the tree, because in some levels it might not
        // be necessary to hash any value.
        for (uint256 i = 0; i < siblingNodes.length; ) {
            if (siblingNodes[i] >= SNARK_SCALAR_FIELD) {
                revert LeafGreaterThanSnarkScalarField();
            }

            // TODO: Make this code more readable.
            // It must count those levels with a separate counter.
            // So that the right level of the sibling can always be retrieved.
            uint256 level = i + s;

            if (oldRoot == self.rightmostNodes[level]) {
                self.rightmostNodes[level] = node;

                if (oldRoot == self.rightmostNodes[level + 1]) {
                    s += 1;
                }

                uint256 j = 0;

                while (oldRoot == self.rightmostNodes[level + j + 1]) {
                    self.rightmostNodes[level + j + 1] = node;

                    unchecked {
                        ++s;
                        ++j;
                    }
                }
            }

            level = i + s;

            if ((index >> level) & 1 != 0) {
                node = PoseidonT3.hash([siblingNodes[i], node]);
                oldRoot = PoseidonT3.hash([siblingNodes[i], oldRoot]);
            } else {
                node = PoseidonT3.hash([node, siblingNodes[i]]);
                oldRoot = PoseidonT3.hash([oldRoot, siblingNodes[i]]);
            }

            unchecked {
                ++i;
            }
        }

        if (oldRoot != root(self)) {
            revert WrongSiblingNodes();
        }

        self.rightmostNodes[self.depth] = node;
        self.leaves[newLeaf] = self.leaves[oldLeaf];
        self.leaves[oldLeaf] = 0;

        return node;
    }

    function remove(
        LeanIMTData storage self,
        uint256 oldLeaf,
        uint256[] calldata siblingNodes
    ) public returns (uint256) {
        return update(self, oldLeaf, 0, siblingNodes);
    }

    function has(LeanIMTData storage self, uint256 leaf) public view returns (bool) {
        return self.leaves[leaf] != 0;
    }

    function indexOf(LeanIMTData storage self, uint256 leaf) public view returns (uint256) {
        return self.leaves[leaf] - 1;
    }

    function root(LeanIMTData storage self) public view returns (uint256) {
        return self.rightmostNodes[self.depth];
    }
}

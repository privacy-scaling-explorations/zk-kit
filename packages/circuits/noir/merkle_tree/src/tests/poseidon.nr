use crate::merkle_tree_membership;
use dep::std::hash::poseidon::bn254::{hash_2, hash_3};

fn poseidon_hasher(leaves: [Field]) -> Field {
    if leaves.len() == 2 {
        hash_2([leaves[0], leaves[1]])
    } else {
        hash_3([leaves[0], leaves[1], leaves[2]])
    }
}

#[test]
fn test_merkle_tree() {
    let root = 0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1;
    let leaf = 0x00;
    let indices = 0x00;
    let hash_path = &[0x01, 0x26059ac500f935d65bf50b096f757fe1dcb3568822d4e4cb7a8dc95f7bbd24f7, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, poseidon_hasher);
}

#[test]
fn test_merkle_tree_2() {
    let root = 0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0x1bd20834f5de9830c643778a2e88a3a1363c8b9ac083d36d75bf87c49953e65e, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, poseidon_hasher);
}

#[test]
fn test_merkle_tree_3() {
    let root = 0x1910f234d14bea7c640841c9fd0d765e8599a4cd527285590e4159e66b912be1;
    let leaf = 0x03;
    let indices = 0x03;
    let hash_path = &[0x02, 0x1bd20834f5de9830c643778a2e88a3a1363c8b9ac083d36d75bf87c49953e65e, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, poseidon_hasher);
}


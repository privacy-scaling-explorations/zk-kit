use crate::merkle_tree_membership;
use dep::std::hash::poseidon2::Poseidon2::hash;

fn poseidon2_hasher(leaves: [Field]) -> Field {
    if leaves.len() == 2 {
        hash([leaves[0], leaves[1]], 2)
    } else {
        hash([leaves[0], leaves[1], leaves[2]], 3)
    }
}

#[test]
fn test_merkle_tree() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let leaf = 0x00;
    let indices = 0x00;
    let hash_path = &[0x01, 0x2bc00d90b885b09d12764e764410f7f693f514f7f3ca14d916741ff3968b3079, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, poseidon2_hasher);
}

#[test]
fn test_merkle_tree_2() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0xdd6d785caa3fe1ad139a40b6bd26fccbd6c8697573b0e34489c740533db5cc8, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, poseidon2_hasher);
}

#[test]
fn test_merkle_tree_3() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0xdd6d785caa3fe1ad139a40b6bd26fccbd6c8697573b0e34489c740533db5cc8, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, poseidon2_hasher);
}


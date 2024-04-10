use crate::merkle_tree_membership;
use dep::std::hash::pedersen::pedersen_hash_slice;

fn pedersen_hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

#[test]
fn test_merkle_tree_1() {
    let root = 0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3;
    let leaf = 0x00;
    let indices = 0x00;
    let hash_path = &[0x01, 0x67635fc829435949ed0ced751d11f3f823087ec463ca6ee53e253fb7e390e74, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, pedersen_hasher);
}

#[test]
fn test_merkle_tree_2() {
    let root = 0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, pedersen_hasher);
}

#[test]
fn test_merkle_tree_3() {
    let root = 0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3;
    let leaf = 0x03;
    let indices = 0x03;
    let hash_path = &[0x02, 0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, pedersen_hasher);
}

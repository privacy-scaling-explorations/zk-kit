use dep::std::hash::{Hash, Hasher};
use dep::std::hash::poseidon2::Poseidon2;
use dep::std::hash::pedersen_hash_slice;
use dep::std::println;

global LEVELS = 3;

fn merkle_tree_membership(
    leaf: Field,
    indices: Field,
    hash_path: [Field],
    root: Field,
    hasher: fn([Field]) -> Field
) {
    let index_bits = indices.to_le_bits(LEVELS as u32);
    let mut current = leaf;
    for i in 0..LEVELS {
        let pair = if (index_bits[i] == 0) {
            &[current, hash_path[i]]
        } else {
            &[hash_path[i], current]
        };
        if (hash_path[i] != 0) {
            current = hasher(pair);
        }
    }
    assert(current == root);
}

#[test]
fn test_merkle_tree_pedersen_1() {
    let root = 0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3;
    let leaf = 0x00;
    let indices = 0x00;
    let hash_path = &[0x01, 0x67635fc829435949ed0ced751d11f3f823087ec463ca6ee53e253fb7e390e74, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, |pair| pedersen_hash_slice(pair));
}

#[test]
fn test_merkle_tree_poseidon_1() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let leaf = 0x00;
    let indices = 0x00;
    let hash_path = &[0x01, 0x2bc00d90b885b09d12764e764410f7f693f514f7f3ca14d916741ff3968b3079, 0x04];
    merkle_tree_membership(
        leaf,
        indices,
        hash_path,
        root,
        |pair : [Field]| Poseidon2::hash([pair[0], pair[1]], 2)
    );
}

#[test]
fn test_merkle_tree_pedersen_2() {
    let root = 0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, |pair| pedersen_hash_slice(pair));
}

#[test]
fn test_merkle_tree_poseidon_2() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0xdd6d785caa3fe1ad139a40b6bd26fccbd6c8697573b0e34489c740533db5cc8, 0x04];
    merkle_tree_membership(
        leaf,
        indices,
        hash_path,
        root,
        |pair : [Field]| Poseidon2::hash([pair[0], pair[1]], 2)
    );
}

#[test]
fn test_merkle_tree_pedersen_3() {
    let root = 0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3;
    let leaf = 0x03;
    let indices = 0x03;
    let hash_path = &[0x02, 0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1, 0x04];
    merkle_tree_membership(leaf, indices, hash_path, root, |pair| pedersen_hash_slice(pair));
}

#[test]
fn test_merkle_tree_poseidon_3() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let leaf = 0x02;
    let indices = 0x02;
    let hash_path = &[0x03, 0xdd6d785caa3fe1ad139a40b6bd26fccbd6c8697573b0e34489c740533db5cc8, 0x04];
    merkle_tree_membership(
        leaf,
        indices,
        hash_path,
        root,
        |pair : [Field]| Poseidon2::hash([pair[0], pair[1]], 2)
    );
}

use dep::std::hash::poseidon2::Poseidon2::hash;
use crate::merkle::MerkleTree;

fn poseidon2_hasher(leaves: [Field]) -> Field {
    if leaves.len() == 2 {
        hash([leaves[0], leaves[1]], 2)
    } else {
        hash([leaves[0], leaves[1], leaves[2]], 3)
    }
}

#[test]
fn test_merkle_tree_membership() {
    let root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let mt = MerkleTree::from(root, poseidon2_hasher);

    let leaf = 0x00;
    let paths = (0x00, &[0x01, 0x2bc00d90b885b09d12764e764410f7f693f514f7f3ca14d916741ff3968b3079, 0x04]);

    mt.membership(leaf, paths);
}

#[test]
fn test_merkle_tree_add() {
    let old_root = 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e;
    let mut mt = MerkleTree::from(old_root, poseidon2_hasher);

    let leaf = 0x2bc00d90b885b09d12764e764410f7f693f514f7f3ca14d916741ff3968b3079;
    let paths = (0x01, &[0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e]);
    mt.add(leaf, paths);
}

#[test]
fn test_merkle_tree_delete() {
    let old_root = 0x2bad56e4964d2660a1785faca4cb13a00c662723a8e8941b4a47e15f36e9968e;
    let mut mt = MerkleTree::from(old_root, poseidon2_hasher);

    let leaf = 0x2bc00d90b885b09d12764e764410f7f693f514f7f3ca14d916741ff3968b3079;
    let paths = (0x00, &[0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e]);

    mt.delete(leaf, paths);

    assert(mt.root == 0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e);
}

#[test]
fn test_merkle_tree_update() {
    let old_root = 0x2bad56e4964d2660a1785faca4cb13a00c662723a8e8941b4a47e15f36e9968e;
    let mut mt = MerkleTree::from(old_root, poseidon2_hasher);

    let old_leaf = 0x2bc00d90b885b09d12764e764410f7f693f514f7f3ca14d916741ff3968b3079;
    let leaf = 0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1;

    let paths = (0x00, &[0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e]);
    mt.update(leaf, old_leaf, paths);

    assert(
        mt.root == poseidon2_hasher(
            &[
            0xd98561fb02ca04d00801dfdc118b2a24cea0351963587712a28d368041370e1,
            0x21447efbbddb57d6fc5ad24d906388492e82c44e5160425258dd4ea995e3a06e
        ]
        )
    );
}

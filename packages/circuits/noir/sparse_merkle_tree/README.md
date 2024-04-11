# Sparse Merkle Tree Circuit

This Noir library can be used to prove the presence, addition, update, or deletion a key-pair from a sparse merkle tree.

## Usage

To use it in your project, add it to its `Nargo.toml` file. For example:

```toml
[dependencies]
smt = { git = "https://github.com/privacy-scaling-explorations/zk-kit", tag = "main", directory = "packages/circuits/noir/sparse_merkle_tree" }
```

And import it in your file. You need to provide a hasher, which is a function that accepts a slice of Fields and returns a Field. Example:

```rust
use dep::smt::SMT;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(
    entry: [Field; 2],
    siblings: [Field; 256],
    root: Field)
{
    let smt = SMT::from(root, hasher);

    smt.membership(entry, siblings.as_slice());
}
```

## Methods

The SMT crate "stores" the root and the hasher and exposes modifier methods, making it easy to prove multiple operations without worrying about the state. For example, if you want to prove that one leaf from an existing tree has been moved to another tree:

```rust
use dep::smt::SMT;
use dep::std::hash::pedersen_hash_slice;

fn main(entry: [Field; 2], siblings: [Field; 256], roots: [Field; 2]) {
    let mut tree1 = SMT::from(roots[0], pedersen_hash_slice);
    let mut tree2 = SMT::from(roots[1], pedersen_hash_slice);

    tree1.membership(entry, siblings.as_slice());
    tree2.non_membership(entry, [0, 0], [0; 256].as_slice());

    tree1.delete(entry, siblings.as_slice());
    tree2.add(entry, [0; 256].as_slice());
}
```

## Tests

This repository provides tests using pedersen, poseidon and poseidon2 hashes. To test them, run `nargo test`;

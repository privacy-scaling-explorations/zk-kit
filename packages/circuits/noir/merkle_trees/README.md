# Merkle Trees Library

This Noir library provides a Merkle Tree (MT) and a Sparse Merkle Tree (SMT) implementation. A Sparse Merkle Tree is basically a Merkle Tree, but the index of each leaf is determined by its key value. This makes the SMT quite useful, for example, for nullifier trees, as it allows for easy non-membership proofs.

## Usage

To use these trees in your project, add the lib to its `Nargo.toml` file. For example:

```toml
[dependencies]
merkle = { git = "https://github.com/privacy-scaling-explorations/zk-kit", tag = "main", directory = "packages/circuits/noir/merkle_trees" }
```

And import it in your file. You need to provide a hasher, which is a function that accepts a slice of Fields and returns a Field. Check the tests folder for some suggestions.

### Examples

A Merkle Tree:

```rust
use dep::merkle::MerkleTree;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(
    entry: [Field; 2],
    siblings: [Field; 256],
    root: Field)
{
    let smt = MerkleTree::new(hasher);

    smt.add(entry, siblings.as_slice());
}
```

A Sparse Merkle Tree:

```rust
use dep::merkle::SparseMerkleTree;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(
    entry: [Field; 2],
    siblings: [Field; 256],
    root: Field)
{
    let smt = SparseMerkleTree::new(hasher);

    smt.membership(entry, siblings.as_slice());
}
```

## Tests

This repository provides tests using pedersen, poseidon and poseidon2 hashes. To test them, `cd` into the folder and run `nargo test`.

# Merkle Tree Circuit

This Noir library can be used to prove the presence of a leaf on a merkle tree.

## Usage

To use it in your project, add it to its `Nargo.toml` file. For example:

```toml
[dependencies]
merkle = { git = "https://github.com/privacy-scaling-explorations/zk-kit", tag = "main", directory = "packages/circuits/noir/merkle_tree" }
```

And import it in your file. You need to provide a hasher, which is a function that accepts a slice of Fields and returns a Field. Check the tests folder for some suggestions.

```rust
use dep::merkle::merkle_tree_membership;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(leaf: Field, indices: Field, hash_path: [Field; 3], root: pub Field) {
    merkle_tree_membership(
        leaf,
        indices,
        hash_path,
        root,
        hasher
    );
}
```

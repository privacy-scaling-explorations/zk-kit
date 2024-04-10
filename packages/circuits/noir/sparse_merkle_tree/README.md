# Sparse Merkle Tree Circuit

This Noir library can be used to prove the presence, addition, update, or deletion a key-pair from a sparse merkle tree.

## Usage

To use it in your project, add it to its `Nargo.toml` file. For example:

```toml
[dependencies]
smt = { git = "https://github.com/privacy-scaling-explorations/zk-kit", tag = "main", directory = "packages/circuits/noir/sparse_merkle_tree" }
```

And import it in your file. You need to provide a hasher, which is a function that accepts a slice of Fields and returns a Field. Check the tests folder for some suggestions.

```rust
use dep::smt::add;
use dep::std::hash::pedersen_hash_slice;

fn hasher(leaves: [Field]) -> Field {
    pedersen_hash_slice(leaves)
}

fn main(key: Field, value: Field, old_root: pub Field, siblings: [Field; 256]) {
    add([key, value], old_root, siblings, hasher)
}
```

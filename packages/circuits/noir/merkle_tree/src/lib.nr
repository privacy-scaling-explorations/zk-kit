mod tests;

fn merkle_tree_membership(
    leaf: Field,
    indices: Field,
    hash_path: [Field],
    root: Field,
    hasher: fn([Field]) -> Field
) {
    let index_bits = indices.to_le_bits(hash_path.len() as u32);
    let mut current = leaf;
    for i in 0..hash_path.len() {
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

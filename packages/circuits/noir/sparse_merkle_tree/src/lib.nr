use dep::std::option::Option;
use crate::utils::{calculcate_root, calculate_two_roots, key_to_path};

mod utils;
mod tests;

/**
 * Verifies a membership or a non-membership proof, ie it calculates the tree root
 * based on an entry or matching entry and all siblings and compares that calculated root
 * with the root that is passed to this function.
 * @param entry Contains key and value of an entry: [key, value]
 * @param matching_entry Contains [key, value] of a matching entry only for non-membership proofs
 * @param siblings Contains array of siblings of entry / matching_entry
 * @param root The expected root of the tree
 */
pub fn verify(
    entry: [Field; 2],
    matching_entry: [Option<Field>; 2],
    siblings: [Field],
    root: Field,
    hasher: fn([Field]) -> Field
) {
    let mut calculated_root: Field = 0;
    let path = key_to_path(entry[0], siblings.len() as u32);
    // if there is no matching_entry it is a membership proof
    // if there is a matching_entry it is a non_membership proof
    if matching_entry[0].is_none() | matching_entry[1].is_none() {
        // membership proof: the root is calculated based on the entry, the siblings,
        // and the path determined by the key of entry through consecutive hashing
        calculated_root = calculcate_root(entry, siblings, path, hasher);
    } else {
        // non-membership proof: the root is calculated based on the matching_entry, the siblings
        // and the path that is determined by the key of entry. This makes sure that matching_entry is in fact
        // a matching entry for entry meaning that it shares the same first bits as path
        calculated_root = calculcate_root([matching_entry[0].unwrap(), matching_entry[1].unwrap()], siblings, path, hasher);
    }
    assert(calculated_root == root);
}

/**
 * Adds a NEW entry to an existing tree. Based on the siblings first validates the correctness of
 * the old root. Then uses the new entry and the siblings to calculate the new tree root.
 * NOTE: this function doesn't validate if the key for the new entry already exists in the tree, ie
 * if the operation is actually an update. For this operation there is a separate function.
 * @param entry Contains key and value of an entry: [key, value]
 * @param old_root The root of the tree before the new entry is added
 * @param siblings Contains array of siblings of entry / matching_entry
 * @returns The new root after the addition
 */
pub fn add(
    new_entry: [Field; 2],
    old_root: Field,
    siblings: [Field],
    hasher: fn([Field]) -> Field
) -> Field {
    // if the root node is zero the first leaf is added to the tree in which case
    // the new root equals H(k,v,1)
    // otherwise the correctness of the old root is validated based on the siblings after which
    // the new root is calculated and returned
    if (old_root == 0) {
        hasher(&[new_entry[0], new_entry[1], 1])
    } else {
        let (old, new) = calculate_two_roots(new_entry, siblings, hasher);
        assert(old == old_root);
        new
    }
}

/**
 * Deletes an existing entry from a tree. Based on the siblings first does a membership proof
 * of that existing entry and then calculates the new root (without the entry).
 * @param entry Contains key and value of the to-be-deleted entry: [key, value]
 * @param old_root The root of the tree if the entry is still included
 * @param siblings Contains array of siblings of entry
 * @returns The new root after the deletion
 */
pub fn delete(
    entry: [Field; 2],
    old_root: Field,
    siblings: [Field],
    hasher: fn([Field]) -> Field
) -> Field {
    // proves membership of entry in the old root, then calculates and returns the new root
    let (new, old) = calculate_two_roots(entry, siblings, hasher);
    assert(old == old_root);
    new
}

/**
 * Updates the value of an existing entry in a tree. Based on the siblings first does a membership proof
 * first verifies the membership of the old entry. Then recalculates the new root.
 * @param new_value The new value to be added (instead of old_entry[1])
 * @param old_entry Contains key and value of the entry to be updated: [key, value]
 * @param old_root The root of the tree before the update
 * @param siblings Contains an array of siblings of old_entry
 * @returns The new root after the update
 */
pub fn update(
    new_value: Field,
    old_entry: [Field; 2],
    old_root: Field,
    siblings: [Field],
    hasher: fn([Field]) -> Field
) -> Field {
    let key = old_entry[0];
    let old_value = old_entry[1];
    // both the old entry and new entry share the same key that is used to calculate the path
    let path = key_to_path(key, siblings.len() as u32);
    // old_parent is a container to temporarily store the nodes that ultimately lead to the OLD root
    let mut old_parent: Field = hasher(&[key, old_value, 1]);
    // new_parent is a container to temporarily store the nodes that ultimately lead to the NEW root
    let mut new_parent: Field = hasher(&[key, new_value, 1]);
    // starting from the bottom of the tree, for each level it checks whether there is a sibling and if
    // that is the case, it hashes the two containers with the sibling and updates the containers with the
    // resulting hashes until the uppermost level is reached aka the root node
    for i in 0..siblings.len() {
        let sibling = siblings[i];
        if sibling != 0 {
            if path[i] == 0 {
                new_parent = hasher(&[new_parent, sibling]);
                old_parent = hasher(&[old_parent, sibling]);
            } else {
                new_parent = hasher(&[sibling, new_parent]);
                old_parent = hasher(&[sibling, old_parent]);
            }
        }
    }
    assert(old_parent == old_root);
    new_parent
}

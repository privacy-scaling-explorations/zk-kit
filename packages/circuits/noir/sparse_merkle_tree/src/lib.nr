use dep::std::option::Option;
use crate::utils::key_to_path;

mod utils;
mod tests;

struct SMT {
    root: Field,
    hasher: fn([Field]) -> Field,
}

trait Creator {
    fn new(hasher: fn([Field]) -> Field) -> Self;
    fn from(root: Field, hasher: fn([Field]) -> Field) -> Self;
}

trait Prover {
    fn membership(self, entry: [Field; 2], siblings: [Field]);
    fn non_membership(self, entry: [Field; 2], matching_entry: [Field; 2], siblings: [Field]);
}

trait Modifier {
    fn add(&mut self, new_entry: [Field; 2], siblings: [Field]);
    fn delete(&mut self, entry: [Field; 2], siblings: [Field]);
    fn update(&mut self, new_value: Field, old_entry: [Field; 2], siblings: [Field]);
}

impl Creator for SMT {
    /**
    * Creates a new Sparse Merkle Tree (SMT) instance.
    * @param hasher The hash function that is used to hash the nodes of the tree
    */
    fn new(hasher: fn([Field]) -> Field) -> Self {
        SMT { root: 0, hasher }
    }

    /**
    * Imports an existing Sparse Merkle Tree (SMT) instance.
    * @param hasher The hash function that is used to hash the nodes of the tree
    * @param root The root of the tree
    */
    fn from(root: Field, hasher: fn([Field]) -> Field) -> Self {
        SMT { root, hasher }
    }

}

impl Prover for SMT {
    /**
    * Verifies a membership proof, ie it calculates the tree root
    * based on an entry and all siblings and compares that calculated root
    * with the root that is passed to this function.
    * @param entry Contains key and value of an entry: [key, value]
    * @param siblings Contains array of siblings of entry / matching_entry
    * @param root The expected root of the tree
    */
    fn membership(self, entry: [Field; 2], siblings: [Field]) {
        let mut calculated_root: Field = 0;
        let path = key_to_path(entry[0], siblings.len() as u32);

        // membership proof: the root is calculated based on the entry, the siblings,
        // and the path determined by the key of entry through consecutive hashing
        calculated_root = self.calculate_root(entry, siblings, path);

        assert(calculated_root == self.root);
    }

    /**
    * Verifies a non-membership proof, ie it calculates the tree root
    * based on an entry and a matching_entry and all siblings and compares that calculated root
    * with the root that is passed to this function.
    * @param entry Contains key and value of an entry: [key, value]
    * @param matching_entry Contains [key, value] of a matching entry only for non-membership proofs
    * @param siblings Contains array of siblings of entry / matching_entry
    * @param root The expected root of the tree
    */
    fn non_membership(self, entry: [Field; 2], matching_entry: [Field; 2], siblings: [Field]) {
        if (self.root != 0) {
            let path = key_to_path(entry[0], siblings.len() as u32);

            // non-membership proof: the root is calculated based on the matching_entry, the siblings
            // and the path that is determined by the key of entry. This makes sure that matching_entry is in fact
            // a matching entry for entry meaning that it shares the same first bits as path
            let mut calculated_root = self.calculate_root([matching_entry[0], matching_entry[1]], siblings, path);
            assert(calculated_root == self.root);
        }
    }
}

impl Modifier for SMT {

    /**
    * Proves the addition of a NEW entry to an existing tree. Based on the siblings first validates the correctness of
    * the old root. Then uses the new entry and the siblings to calculate the new tree root.
    * NOTE: this function doesn't validate if the key for the new entry already exists in the tree, ie
    * if the operation is actually an update. For this operation there is a separate function.
    * @param entry Contains key and value of an entry: [key, value]
    * @param old_root The root of the tree before the new entry is added
    * @param siblings Contains array of siblings of entry / matching_entry
    * @returns The new root after the addition
    */
    fn add(&mut self, new_entry: [Field; 2], siblings: [Field]) {
        // if the root node is zero the first leaf is added to the tree in which case
        // the new root equals H(k,v,1)
        // otherwise the correctness of the old root is validated based on the siblings after which
        // the new root is calculated and returned
        if (self.root == 0) {
            self.root = (self.hasher)(&[new_entry[0], new_entry[1], 1]);
        } else {
            let (old, new) = self.calculate_two_roots(new_entry, siblings);
            assert(old == self.root);
            self.root = new;
        }
    }

    /**
    * Proves the deletion of an existing entry from a tree. Based on the siblings first does a membership proof
    * of that existing entry and then calculates the new root (without the entry).
    * @param entry Contains key and value of the to-be-deleted entry: [key, value]
    * @param old_root The root of the tree if the entry is still included
    * @param siblings Contains array of siblings of entry
    * @returns The new root after the deletion
    */
    fn delete(&mut self, entry: [Field; 2], siblings: [Field]) {
        // proves membership of entry in the old root, then calculates and returns the new root
        let (new, old) = self.calculate_two_roots(entry, siblings);
        assert(old == self.root);
        self.root = new;
    }

    /**
    * Proves the update of the value of an existing entry in a tree. Based on the siblings first does a membership proof
    * first verifies the membership of the old entry. Then recalculates the new root.
    * @param new_value The new value to be added (instead of old_entry[1])
    * @param old_entry Contains key and value of the entry to be updated: [key, value]
    * @param old_root The root of the tree before the update
    * @param siblings Contains an array of siblings of old_entry
    * @returns The new root after the update
    */
    fn update(&mut self, new_value: Field, old_entry: [Field; 2], siblings: [Field]) {
        let key = old_entry[0];
        let old_value = old_entry[1];
        // both the old entry and new entry share the same key that is used to calculate the path
        let path = key_to_path(key, siblings.len() as u32);
        // old_parent is a container to temporarily store the nodes that ultimately lead to the OLD root
        let mut old_parent: Field = (self.hasher)(&[key, old_value, 1]);
        // new_parent is a container to temporarily store the nodes that ultimately lead to the NEW root
        let mut new_parent: Field = (self.hasher)(&[key, new_value, 1]);
        // starting from the bottom of the tree, for each level it checks whether there is a sibling and if
        // that is the case, it hashes the two containers with the sibling and updates the containers with the
        // resulting hashes until the uppermost level is reached aka the root node
        for i in 0..siblings.len() {
            let sibling = siblings[i];
            if sibling != 0 {
                if path[i] == 0 {
                    new_parent = (self.hasher)(&[new_parent, sibling]);
                    old_parent = (self.hasher)(&[old_parent, sibling]);
                } else {
                    new_parent = (self.hasher)(&[sibling, new_parent]);
                    old_parent = (self.hasher)(&[sibling, old_parent]);
                }
            }
        }
        assert(old_parent == self.root);
        self.root = new_parent;
    }
}

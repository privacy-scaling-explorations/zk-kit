use crate::{Creator, MembershipProver, NonMembershipProver, Modifier};

mod tree;
mod tests;

struct SparseMerkleTree {
    root: Field,
    hasher: fn([Field]) -> Field,
}

impl Creator for SparseMerkleTree {
    fn default(root: Field, hasher: fn([Field]) -> Field) -> Self {
        Self { root, hasher }
    }
}

impl MembershipProver<(Field, Field), [Field]> for SparseMerkleTree {
    fn membership(self, entry: (Field, Field), siblings: [Field]) {
        let mut calculated_root: Field = 0;

        // membership proof: the root is calculated based on the entry, the siblings,
        // and the path determined by the key of entry through consecutive hashing
        calculated_root = self.calculate_root(entry, (entry.0, siblings));

        assert(calculated_root == self.root);
    }
}

impl NonMembershipProver for SparseMerkleTree {
    fn non_membership(self, entry: (Field, Field), matching_entry: (Field, Field), siblings: [Field]) {
        if (self.root != 0) {

            // non-membership proof: the root is calculated based on the matching_entry, the siblings
            // and the path that is determined by the key of entry. This makes sure that matching_entry is in fact
            // a matching entry for entry meaning that it shares the same first bits as path
            let mut calculated_root = self.calculate_root(matching_entry, (entry.0, siblings));
            assert(calculated_root == self.root);
        }
    }
}

impl Modifier<(Field, Field), [Field]> for SparseMerkleTree {
    fn add(&mut self, new_entry: (Field, Field), siblings: [Field]) {
        // if the root node is zero the first leaf is added to the tree in which case
        // the new root equals H(k,v,1)
        // otherwise the correctness of the old root is validated based on the siblings after which
        // the new root is calculated and returned
        if (self.root == 0) {
            self.root = (self.hasher)(&[new_entry.0, new_entry.1, 1]);
        } else {
            let (old, new) = self.calculate_two_roots(new_entry, (new_entry.0, siblings));
            assert(old == self.root);
            self.root = new;
        }
    }

    fn delete(&mut self, entry: (Field, Field), siblings: [Field]) {
        // proves membership of entry in the old root, then calculates and returns the new root
        let (new, old) = self.calculate_two_roots(entry, (entry.0, siblings));
        assert(old == self.root);
        self.root = new;
    }

    fn update(&mut self, new_value: Field, old_entry: (Field, Field), siblings: [Field]) {
        let key = old_entry.0;
        let old_value = old_entry.1;
        // both the old entry and new entry share the same key that is used to calculate the path
        let path = key.to_be_bits(siblings.len() as u32);

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

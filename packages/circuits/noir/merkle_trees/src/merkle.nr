use crate::{Creator, MembershipProver, NonMembershipProver, Modifier};

mod tree;
mod tests;

struct MerkleTree {
    hasher: fn([Field]) -> Field,
    root: Field
}

impl Creator for MerkleTree {
    fn default(root: Field, hasher: fn([Field]) -> Field) -> Self {
        Self { root, hasher }
    }
}

impl MembershipProver<Field, HashPath> for MerkleTree {
    fn membership(self, leaf: Field, siblings: (Field, [Field])) {
        let root = self.calculate_root(leaf, siblings);
        assert(self.root == root);
    }

}

impl Modifier<Field, HashPath> for MerkleTree {
    fn add(&mut self, leaf: Field, siblings: (Field, [Field])) {
        let (old, new) = self.calculate_two_roots(leaf, siblings);

        assert(old == self.root);
        self.root = new;
    }

    fn delete(&mut self, leaf: Field, siblings: (Field, [Field])) {
        let (new, old) = self.calculate_two_roots(leaf, siblings);
        assert(old == self.root);
        self.root = new;
    }

    fn update(&mut self, leaf: Field, old_leaf: Field, siblings: (Field, [Field])) {
        let index_bits = siblings.0.to_le_bits(siblings.1.len() as u32);

        let mut old_parent: Field = old_leaf;
        let mut new_parent: Field = leaf;

        for i in 0..siblings.1.len() {
            let sibling = siblings.1[i];
            if sibling != 0 {
                if index_bits[i] == 0 {
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

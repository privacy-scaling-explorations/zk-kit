use crate::{Creator, MembershipProver, NonMembershipProver, Modifier};
use crate::merkle::tree::HashPath;

mod tree;
mod tests;

struct MerkleTree {
    hasher: fn([Field]) -> Field,
    root: Field
}

impl Creator for MerkleTree {
    fn from(root: Field, hasher: fn([Field]) -> Field) -> Self {
        Self { root, hasher }
    }
}

impl MembershipProver<Field, HashPath> for MerkleTree {
    fn membership(self, leaf: Field, path: HashPath) {
        let root = self.calculate_root(leaf, path.indices, path.siblings);
        assert(self.root == root);
    }

}

impl Modifier<Field, HashPath> for MerkleTree {
    fn add(&mut self, leaf: Field, path: HashPath) {
        if (self.root == 0) {
            self.root = leaf;
        } else {
            let (old, new) = self.calculate_two_roots(leaf, path);

            assert(old == self.root);
            self.root = new;
        }
    }

    fn delete(&mut self, leaf: Field, paths: HashPath) {
        let (new, old) = self.calculate_two_roots(leaf, paths);
        assert(old == self.root);
        self.root = new;
    }

    fn update(&mut self, leaf: Field, old_leaf: Field, paths: HashPath) {
        let index_bits = paths.indices.to_le_bits(paths.siblings.len() as u32);

        let mut old_parent: Field = old_leaf;
        let mut new_parent: Field = leaf;

        for i in 0..paths.siblings.len() {
            let sibling = paths.siblings[i];
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

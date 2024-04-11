use crate::merkle::MerkleTree;

trait Calculator {
    fn calculate_root(self, leaf: Field, indices: Field, hash_path: [Field]) -> Field;
    fn calculate_two_roots(self, leaf: Field, paths: HashPath) -> (Field, Field);
}

struct HashPath {
    indices: Field,
    siblings: [Field],
}

impl Calculator for MerkleTree {
    fn calculate_root(self, leaf: Field, indices: Field, hash_path: [Field]) -> Field {
        let index_bits = indices.to_le_bits(hash_path.len() as u32);
        let mut current = leaf;
        for i in 0..hash_path.len() {
            let pair = if (index_bits[i] == 0) {
                &[current, hash_path[i]]
            } else {
                &[hash_path[i], current]
            };
            if (hash_path[i] != 0) {
                current = (self.hasher)(pair);
            }
        }
        current
    }

    /*
    * Calculates two roots for a given leaf entry based on the passed array of siblings: one root 
    * for if the leaf entry was included in the tree and one for if the leaf entry was not included
    * in the tree. This is useful for efficiently proving the membership of leaf entries for a
    * tree while simultaneously modifying the tree.
    * @param entry The key and value of an entry [k, v]
    * @param siblings Contains the siblings from bottom to top
    * @returns Two root nodes: the first one doesn't include entry, the second does
    */
    fn calculate_two_roots(
        self,
        leaf: Field,
        paths: HashPath,
    ) -> (Field, Field) {
        let index_bits = paths.indices.to_le_bits(paths.siblings.len() as u32);

        let mut root_with_leaf = leaf;
        let mut root_without_leaf = 0;
        
        for i in 0..paths.siblings.len() {
            let sibling = paths.siblings[i];

            if (sibling != 0) {
                if i == paths.siblings.len() - 1 {
                    root_without_leaf = paths.siblings[i];
                }

                if (index_bits[i] == 0) {
                    root_with_leaf = (self.hasher)(&[root_with_leaf, sibling]);

                    if (root_without_leaf != sibling) {
                        root_without_leaf = (self.hasher)(&[root_without_leaf, sibling]);
                    }
                } else {
                    root_with_leaf = (self.hasher)(&[sibling, root_with_leaf]);
                    if (root_without_leaf != sibling) {
                        root_without_leaf = (self.hasher)(&[sibling, root_without_leaf]);
                    }
                };

            }
        }
        (root_without_leaf, root_with_leaf)
    }

}

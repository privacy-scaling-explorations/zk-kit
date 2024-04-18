use dep::std::hash::pedersen_hash_slice;
use crate::sparse_merkle::SparseMerkleTree;
use crate::Calculator;

impl Calculator<(Field, Field)> for SparseMerkleTree {
    /*
    * Calculates the root for a given tree entry based on the passed array of siblings and the passed path.
    * @param entry The key and value of an entry [k, v]
    * @param siblings Contains the siblings from bottom to top
    * @param path The position of the entry in the tree as represented by bits from bottom to top
    * @returns The calculated root node
    */
    fn calculate_root(
        self,
        entry: (Field, Field),
        siblings: (Field, [Field]),
    ) -> Field {
        let index_bits = siblings.0.to_be_bits(siblings.1.len() as u32);

        // serves as container for hashes and is initialized to be the leaf node
        let mut node = (self.hasher)(&[entry.0, entry.1, 1]);
        // iterates over the list of siblings until the first sibling is found
        // arbitrarily assigns the sibling to be the left and the node to be the 
        // right element of the hashing pair unless the path indicates the opposite
        // order in which case the order is changed. The new hash is stored in the container
        // until the root node is reached and returned.
        for i in 0..siblings.1.len() {
            let sibling = siblings.1[i];
            if sibling != 0 {
                let mut left = sibling;
                let mut right = node;
                if index_bits[i] == 0 {
                    left = node;
                    right = sibling;
                }
                node = (self.hasher)(&[left, right]);
            }
        }
        node
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
        entry: (Field, Field),
        siblings: (Field, [Field])
    ) -> (Field, Field) {
        let index_bits = siblings.0.to_be_bits(siblings.1.len() as u32);

        // root_with_leaf is a container for hashes to derive the root node for the tree that
        // includes the entry
        let mut root_with_leaf = (self.hasher)(&[entry.0, entry.1, 1]);
        // root_without_leaf is a container for hashes to derive the root node for the tree that
        // doesn't include the entry
        let mut root_without_leaf: Field = 0;
        // iterate over the levels of the tree from bottom to top
        for i in 0..siblings.1.len() {
            let sibling = siblings.1[i];
            // After the first sibling is found, the processes are started to calculate the two root nodes.
            // The calulcation of the root node that includes the entry is comparable to `calculate_root`. 
            // To calc the root node that doesn't include entry, the first sibling is put into the container
            // and starting from each SUBSEQUENT iteration it is hashed with its sibling and the resulting hash
            // again stored in the container until the root is reached
            if sibling != 0 {
                if siblings.1[i - 1] == 0 {
                    root_without_leaf = siblings.1[i];
                }
                if index_bits[i] == 0 {
                    root_with_leaf = (self.hasher)(&[root_with_leaf, sibling]);
                    if (root_without_leaf != sibling) {
                        root_without_leaf = (self.hasher)(&[root_without_leaf, sibling]);
                    }
                } else {
                    root_with_leaf = (self.hasher)(&[sibling, root_with_leaf]);
                    if (root_without_leaf != sibling) {
                        root_without_leaf = (self.hasher)(&[sibling, root_without_leaf]);
                    }
                }
            }
        }
        (root_without_leaf, root_with_leaf)
    }
}

#[test]
fn test_hash_leaf_node() {
    let key = 20438969296305830531522370305156029982566273432331621236661483041446048135547;
    let value = 17150136040889237739751319962368206600863150289695545292530539263327413090784;
    assert(
        pedersen_hash_slice(&[key, value, 1])
        == 0x055b34560562b842e236f919e9a74ee345d7523d70f711e0ccdb22466c767c20
    );
}

#[test]
fn test_hash_node() {
    let left = 7374494214024125590767526270082639043919066776944047470878693145844636921798;
    let right = 3315292394704439116482935361251007857050519763420264982454883186141315324846;
    assert(
        pedersen_hash_slice(&[left, right])
        == 0x05f8a24a037ad8567c042c14c5a8299649e0fe13df1cec40d381a3671bae9245
    );
}

use dep::std::hash::poseidon;
use crate::TREE_DEPTH;

/*
 * Transforms the key into into a big endian array of bits so that when determining the position
 * of a tree entry starting from the root node, the first array element to look at is the last.
 * @param key The key of a tree entry
 * @returns The path that determines the position of a key in the tree
 */
pub fn key_to_path(key: Field) -> [u1] {
    key.to_be_bits(TREE_DEPTH)
}

/*
 * Calculates the poseidon bn254 hash. If a leaf node is created, the number 1 is appended to 
 * the hashed values as follows: H(k,v,1).
 * @param left The left element of the hashing pair
 * @param right The right element of the hashing pair
 * @param is_leaf Whether what is created is a leaf node or not
 * @returns The poseidon hash
 */
pub fn hash(left: Field, right: Field, is_leaf: bool) -> Field {
    if (is_leaf) {
        poseidon::bn254::hash_3([left, right, 1])
    } else {
        poseidon::bn254::hash_2([left, right])
    }
}


/*
 * Calculates the root for a given tree entry based on the passed array of siblings and the passed path.
 * @param entry The key and value of an entry [k, v]
 * @param siblings Contains the siblings from bottom to top
 * @param path The position of the entry in the tree as represented by bits from bottom to top
 * @returns The calculated root node
 */
pub fn calculcate_root(entry: [Field; 2], siblings: [Field; TREE_DEPTH], path: [u1]) -> Field {
    // serves as container for hashes and is initialized to be the leaf node
    let mut node = hash(entry[0], entry[1], true);
    // iterates over the list of siblings until the first sibling is found
    // arbitrarily assigns the sibling to be the left and the node to be the 
    // right element of the hashing pair unless the path indicates the opposite
    // order in which case the order is changed. The new hash is stored in the container
    // until the root node is reached and returned.
    for i in 0..TREE_DEPTH {
        let sibling = siblings[i];
        if sibling != 0 {
            let mut left = sibling;
            let mut right = node;
            if path[i] == 0 {
                left = node;
                right = sibling;
            }
            node = hash(left, right, false);
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
pub fn calculate_two_roots(entry: [Field; 2], siblings: [Field; TREE_DEPTH]) -> (Field, Field) {
    let path = key_to_path(entry[0]);
    // long_path_node is a container for hashes to derive the root node for the tree that
    // includes the entry
    let mut long_path_node = hash(entry[0], entry[1], true);
    // long_path_node is a container for hashes to derive the root node for the tree that
    // doesn't include the entry
    let mut short_path_node: Field = 0;
    // iterate over the levels of the tree from bottom to top
    for i in 0..TREE_DEPTH {
        let sibling = siblings[i];
        // After the first sibling is found, the processes are started to calculate the two root nodes.
        // The calulcation of the root node that includes the entry is comparable to `calculate_root`. 
        // To calc the root node that doesn't include entry, the first sibling is put into the container
        // and starting from each SUBSEQUENT iteration it is hashed with its sibling and the resulting hash
        // again stored in the container until the root is reached
        if sibling != 0 {
            if siblings[i - 1] == 0 {
                short_path_node = siblings[i];
            }
            if path[i] == 0 {
                long_path_node = hash(long_path_node, sibling, false);
                if(short_path_node != sibling) {
                    short_path_node = hash(short_path_node, sibling, false);
                }
            } else {
                long_path_node = hash(sibling, long_path_node, false);
                if(short_path_node != sibling) {
                    short_path_node = hash(sibling, short_path_node, false);
                }
            }
        }
    }
    (short_path_node, long_path_node)
}

#[test]
fn test_hash_leaf_node() {
    let key = 20438969296305830531522370305156029982566273432331621236661483041446048135547;
    let value = 17150136040889237739751319962368206600863150289695545292530539263327413090784;
    assert(hash(key, value, true) == 7842913321420301106140788486336995496832503825951977327575501561489697540557);
}

#[test]
fn test_hash_node() {
    let left = 7901139023013500965671892970738327280683439536483910503527659926438417204955;
    let right = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    assert(hash(left, right, false) == 4657474665007910823901096287220097081233671466281873230928277896829046731272);
}

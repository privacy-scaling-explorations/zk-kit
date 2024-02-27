use dep::std::option::Option;

mod utils;

global TREE_DEPTH: u32 = 256; 

/**
 * Verifies a membership or a non-membership proof, ie it calculates the tree root
 * based on an entry or matching entry and all siblings and compares that calculated root
 * with the root that is passed to this function.
 * @param entry Contains key and value of an entry: [key, value]
 * @param matching_entry Contains [key, value] of a matching entry only for non-membership proofs
 * @param siblings Contains array of siblings of entry / matching_entry
 * @param root The expected root of the tree
 */
pub fn verify(entry: [Field; 2], matching_entry: [Option<Field>; 2], siblings: [Field; TREE_DEPTH], root: Field) {
    let mut calculcated_root: Field = 0;
    let path = utils::key_to_path(entry[0]);
    // if there is no matching_entry it is a membership proof
    // if there is a matching_entry it is a non_membership proof
    if matching_entry[0].is_none() | matching_entry[1].is_none() {
        // membership proof: the root is calculated based on the entry, the siblings,
        // and the path determined by the key of entry through consecutive hashing
        calculcated_root = utils::calculcate_root(entry, siblings, path);
    } else {
        // non-membership proof: the root is calculated based on the matching_entry, the siblings
        // and the path that is determined by the key of entry. This makes sure that matching_entry is in fact
        // a matching entry for entry meaning that it shares the same first bits as path
        calculcated_root = utils::calculcate_root([matching_entry[0].unwrap(), matching_entry[1].unwrap()], siblings, path);
    }
    assert(calculcated_root == root);
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
pub fn add(new_entry: [Field; 2], old_root: Field, siblings: [Field; TREE_DEPTH]) -> Field {
    // if the root node is zero the first leaf is added to the tree in which case
    // the new root equals H(k,v,1)
    // otherwise the correctness of the old root is validated based on the siblings after which
    // the new root is calculated and returned
    if (old_root == 0) {
        utils::hash(new_entry[0], new_entry[1], true)
    } else {
        let (old, new) = utils::calculate_two_roots(new_entry, siblings);
        assert(old == old_root);
        new
    }
}

/**
 * Deletes an existing entry from a tree. Based on the siblings first does a membership proof
 * of that existing entry and then calculates the new root (without the entry).
 * @param entry Contains key and value of the to-be-deleted entry: [key, value]
 * @param old_root The root of the tree if the entry is still included
 * @param sigbils Contains array of siblings of entry
 * @returns The new root after the deletion
 */
pub fn delete(entry: [Field; 2], old_root: Field, siblings: [Field; TREE_DEPTH]) -> Field {
    // proves membership of entry in the old root, then calculates and returns the new root
    let (new, old) = utils::calculate_two_roots(entry, siblings);
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
pub fn update(new_value: Field, old_entry: [Field; 2], old_root: Field, siblings: [Field; TREE_DEPTH]) -> Field {
    let key = old_entry[0];
    let old_value = old_entry[1];
    // both the old entry and new entry share the same key that is used to calculate the path
    let path = utils::key_to_path(key);
    // old_parent is a container to temporarily store the nodes that ultimately lead to the OLD root
    let mut old_parent: Field = utils::hash(key, old_value, true);
    // new_parent is a container to temporarily store the nodes that ultimately lead to the NEW root
    let mut new_parent: Field = utils::hash(key, new_value, true);
    // starting from the bottom of the tree, for each level it checks whether there is a sibling and if
    // that is the case, it hashes the two containers with the sibling and updates the containers with the
    // resulting hashes until the uppermost level is reached aka the root node
    for i in 0..TREE_DEPTH {
        let sibling = siblings[i];
        if sibling != 0 {
            if path[i] == 0 {
                new_parent = utils::hash(new_parent, sibling, false);
                old_parent = utils::hash(old_parent, sibling, false);
            } else {
                new_parent = utils::hash(sibling, new_parent, false);
                old_parent = utils::hash(sibling, old_parent, false);
            }
        }
    }
    assert(old_parent == old_root);
    new_parent
}

/*
Visual representations of the trees used in the tests for reference

The big tree corresponds to the tree that is used for
testing in @zk-kit/smt:

big_tree_root: 46574...31272
├── 1: 78429...40557
│   ├── 1
│   ├── v: 17150...90784
│   └── k: 20438...35547
└── 0:
    ├── 1: 74148...2867
    │   ├── 1: 89272...68433        || This leaf 
    │   │   ├── 1                   || is missing 
    │   │   ├── v: 85103...45170    || for the
    │   │   └── k: 84596...08785    || small_tree_root
    │   └── 0: 18126...22196    
    │       ├── 1
    │       ├── v: 13761...25802
    │       └── k: 13924...78098
    └── 0: 79011...20495
        ├── 1
        ├── v: 10223...67791
        └── k: 18746...38844

The small tree lacks one leaf as indicated in the previous
tree and looks as follows:

small_tree_root: 35328...54128
├── 1: 78429...40557
│   ├── 1
│   ├── v: 17150...90784
│   └── k: 20438...35547
└── 0:
    ├── 1: 18126...22196
    │   ├── 1
    │   ├── v: 13761...25802
    │   └── k: 13924...78098
    └── 0: 79011...20495
        ├── 1
        ├── v: 10223...67791
        └── k: 18746...38844
*/

#[test]
fn test_verify_membership_proof() {
    let small_tree_root = 3532809757480436997969526334543526996242857122876262144596246439822675654128;
    let key = 18746990989203767017840856832962652635369613415011636432610873672704085238844;
    let value = 10223238458026721676606706894638558676629446348345239719814856822628482567791;
    let entry = [key, value];
    let matching_entry = [Option::none(), Option::none()];
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[254] = 18126944477260144816572365299295230808286197301459941187567621915186392922196;
    siblings[255] = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    verify(entry, matching_entry, siblings, small_tree_root);
}

#[test]
fn test_verify_non_membership_proof() {
    let small_tree_root = 3532809757480436997969526334543526996242857122876262144596246439822675654128;
    let key = 8459688297517826598613412977307486050019239051864711035321718508109192087854;
    let value = 8510347201346963732943571140849185725417245763047403804445415726302354045170;
    let entry = [key, value];
    let matching_entry = [
        Option::some(13924553918840562069536446401916499801909138643922241340476956069386532478098), 
        Option::some(13761779908325789083343687318102407319424329800042729673292939195255502025802)
    ];
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[254] = 14443001516360873457302534246953033880503978184674311810335857314606403404583;
    siblings[255] = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    verify(entry, matching_entry, siblings, small_tree_root);
}

#[test]
fn test_add_first_element() {
    let key = 20438969296305830531522370305156029982566273432331621236661483041446048135547;
    let value = 17150136040889237739751319962368206600863150289695545292530539263327413090784;
    let entry = [key, value];
    let siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    let zero_node = 0;
    assert(add(entry, zero_node, siblings) == 7842913321420301106140788486336995496832503825951977327575501561489697540557);
}

#[test]
fn test_add_element_to_one_element_tree() {
    let key = 8459688297517826598613412977307486050019239051864711035321718508109192087854;
    let value = 8510347201346963732943571140849185725417245763047403804445415726302354045170;
    let entry = [key, value];
    let old_root = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[255] = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    assert(add(entry, old_root, siblings) == 6309163561753770186763792861087421800063032915545949912480764922611421686766);
}

#[test]
fn test_add_element_to_existing_tree() {
    let key = 8459688297517826598613412977307486050019239051864711035321718508109192087854;
    let value = 8510347201346963732943571140849185725417245763047403804445415726302354045170;
    let entry = [key, value];
    let small_tree_root = 3532809757480436997969526334543526996242857122876262144596246439822675654128;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[253] = 18126944477260144816572365299295230808286197301459941187567621915186392922196;
    siblings[254] = 14443001516360873457302534246953033880503978184674311810335857314606403404583;
    siblings[255] = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    let big_tree_root = 4657474665007910823901096287220097081233671466281873230928277896829046731272;
    assert(add(entry, small_tree_root, siblings) == big_tree_root);
}

#[test]
fn test_delete() {
    let key = 8459688297517826598613412977307486050019239051864711035321718508109192087854;
    let value = 8510347201346963732943571140849185725417245763047403804445415726302354045170;
    let entry = [key, value];
    let big_tree_root = 4657474665007910823901096287220097081233671466281873230928277896829046731272;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[253] = 18126944477260144816572365299295230808286197301459941187567621915186392922196;
    siblings[254] = 14443001516360873457302534246953033880503978184674311810335857314606403404583;
    siblings[255] = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    let small_tree_root = 3532809757480436997969526334543526996242857122876262144596246439822675654128;
    assert(delete(entry, big_tree_root, siblings) == small_tree_root);
}

#[test]
fn test_update() {
    let key = 8459688297517826598613412977307486050019239051864711035321718508109192087854;
    let old_value = 8510347201346963732943571140849185725417245763047403804445415726302354045169;
    let new_value = 8510347201346963732943571140849185725417245763047403804445415726302354045170;
    let old_entry = [key, old_value];
    let old_root = 4202917944688591919039016743999516589372052081571553696755434379850460220435;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[253] = 18126944477260144816572365299295230808286197301459941187567621915186392922196;
    siblings[254] = 14443001516360873457302534246953033880503978184674311810335857314606403404583;
    siblings[255] = 7842913321420301106140788486336995496832503825951977327575501561489697540557;
    let big_tree_root = 4657474665007910823901096287220097081233671466281873230928277896829046731272;
    assert(update(new_value, old_entry, old_root, siblings) == big_tree_root);
}
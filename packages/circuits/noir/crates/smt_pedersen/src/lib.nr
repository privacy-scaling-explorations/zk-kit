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
 * @param siblings Contains array of siblings of entry
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

#[test]
fn test_verify_membership_proof() {
    let root = 10163036226218365628416274178218539053881692695713984759452839539868301499377;
    let key = 20438969296305830531522370305156029982566273432331621236661483041446048135547;
    let value = 17150136040889237739751319962368206600863150289695545292530539263327413090784;
    let entry = [key, value];
    let matching_entry = [Option::none(), Option::none()];
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[253] = 16005544925904787818741660841048975184697157987475781759237359957800253937014;
    siblings[254] = 652515607053222641420986801717363174355390181496524320106921145388058577161;
    siblings[255] = 2708335068696962380008982791185936221130805655713417587265130133162794982262;
    verify(entry, matching_entry, siblings, root);
}

#[test]
fn test_verify_non_membership_proof() {
    let small_tree_root = 10163036226218365628416274178218539053881692695713984759452839539868301499377;
    let key = 20438969296305830531522380305156029982566273432331621236661483041446048135547;
    let value = 17150136040889237739751319962368206600863250289695545292530539263327413090784;
    let entry = [key, value];
    let matching_entry = [
        Option::some(20438969296305830531522370305156029982566273432331621236661483041446048135547), 
        Option::some(17150136040889237739751319962368206600863150289695545292530539263327413090784)
    ];
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[253] = 16005544925904787818741660841048975184697157987475781759237359957800253937014;
    siblings[254] = 652515607053222641420986801717363174355390181496524320106921145388058577161;
    siblings[255] = 2708335068696962380008982791185936221130805655713417587265130133162794982262;
    verify(entry, matching_entry, siblings, small_tree_root);
}

#[test]
fn test_add_first_element() {
    let key = 20438969296305830531522370305156029982566273432331621236661483041446048135547;
    let value = 17150136040889237739751319962368206600863150289695545292530539263327413090784;
    let entry = [key, value];
    let siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    let zero_node = 0;
    assert(add(entry, zero_node, siblings) == 2422708535743783816563452741494007579003622904961533867614614610167375232032);
}

#[test]
fn test_add_element_to_one_element_tree() {
    let key = 7374494214024125590767526270082639043919066776944047470878693145844636921798;
    let value = 3315292394704439116482935361251007857050519763420264982454883186141315324846;
    let entry = [key, value];
    let old_root = 2422708535743783816563452741494007579003622904961533867614614610167375232032;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[255] = 2422708535743783816563452741494007579003622904961533867614614610167375232032;
    assert(add(entry, old_root, siblings) == 13995819305603022633355680906127521476353407789113491617487780281225566393218);
}

#[test]
fn test_add_element_to_existing_tree() {
    let key = 12467743582502009806452203915647380852106587605639139696405928234368558796420;
    let value = 7661601117049907361128926075270530269257730340678343102988736234309528818274;
    let entry = [key, value];
    let root = 13995819305603022633355680906127521476353407789113491617487780281225566393218;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[254] = 18033090709903916521866304938786912938158112601014366947614987606463992198712;
    siblings[255] = 2422708535743783816563452741494007579003622904961533867614614610167375232032;
    let big_tree_root = 8307334591379324778417663235463648615723981385559143500721691536202573318888;
    assert(add(entry, root, siblings) == big_tree_root);
}

#[test]
fn test_delete() {
    let key = 12467743582502009806452203915647380852106587605639139696405928234368558796420;
    let value = 7661601117049907361128926075270530269257730340678343102988736234309528818274;
    let entry = [key, value];
    let big_tree_root = 8307334591379324778417663235463648615723981385559143500721691536202573318888;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[254] = 18033090709903916521866304938786912938158112601014366947614987606463992198712;
    siblings[255] = 2422708535743783816563452741494007579003622904961533867614614610167375232032;
    let small_tree_root = 13995819305603022633355680906127521476353407789113491617487780281225566393218;
    assert(delete(entry, big_tree_root, siblings) == small_tree_root);
}

#[test]
fn test_update() {
    let key = 12467743582502009806452203915647380852106587605639139696405928234368558796420;
    let old_value = 7661601117049907361128926075270530269257730340678343102988736234309528818274;
    let new_value = 7661601117049907361128926075270530269257730340678343102988736234309528818275;
    let old_entry = [key, old_value];
    let old_root = 8307334591379324778417663235463648615723981385559143500721691536202573318888;
    let mut siblings: [Field; TREE_DEPTH] = [0; TREE_DEPTH];
    siblings[254] = 18033090709903916521866304938786912938158112601014366947614987606463992198712;
    siblings[255] = 2422708535743783816563452741494007579003622904961533867614614610167375232032;
    let big_tree_root = 15109801937676825792951435733056938044336635984778954078779396173428619028936;
    assert(update(new_value, old_entry, old_root, siblings) == big_tree_root);
}

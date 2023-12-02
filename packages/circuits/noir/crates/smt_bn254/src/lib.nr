use dep::std::option::Option;

mod utils;

global TREE_DEPTH: u32 = 256; 

pub fn verify(entry: [Field; 2], matching_entry: [Option<Field>; 2], siblings: [Field; TREE_DEPTH], root: Field) {
    let mut calculcated_root: Field = 0;
    if matching_entry[0].is_none() | matching_entry[1].is_none() {
        calculcated_root = utils::calculcate_root(entry, siblings);
    } else {
        calculcated_root = utils::calculcate_root([matching_entry[0].unwrap(), matching_entry[1].unwrap()], siblings);
    }
    assert(calculcated_root == root);
}

pub fn add(entry: [Field; 2], old_root: Field, siblings: [Field; TREE_DEPTH]) -> Field {
    if (old_root == 0) {
        utils::hash(entry[0], entry[1], true)
    } else {
        let (old, new) = utils::calculate_two_roots(entry, siblings);
        assert(old == old_root);
        new
    }
}

pub fn delete(entry: [Field; 2], old_root: Field, siblings: [Field; TREE_DEPTH]) -> Field {
    let (new, old) = utils::calculate_two_roots(entry, siblings);
    assert(old == old_root);
    new 
}

pub fn update(new_value: Field, old_entry: [Field; 2], old_root: Field, siblings: [Field; TREE_DEPTH]) -> Field {
    let key = old_entry[0];
    let old_value = old_entry[1];
    let mut old_parent: Field = utils::hash(key, old_value, true);
    let mut new_parent: Field = utils::hash(key, new_value, true);
    let path = utils::key_to_path(key);
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
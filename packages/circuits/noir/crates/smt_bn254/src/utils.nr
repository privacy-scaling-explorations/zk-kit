use dep::std::hash::poseidon;

pub fn key_to_path(key: Field) -> [u1] {
    key.to_be_bits(256)
}

pub fn hash(left: Field, right: Field, is_leaf: bool) -> Field {
    if (is_leaf) {
        poseidon::bn254::hash_3([left, right, 1])
    } else {
        poseidon::bn254::hash_2([left, right])
    }
}

pub fn calculcate_root(mut node: Field, siblings: [Field; 256], path: [u1]) -> Field {
    for i in 0..256 {
        let sibling = siblings[i];
        if sibling != 0 {
            let mut left = sibling;
            let mut right = node;
            let own_position = path[i];
            if own_position == 0 {
                left = node;
                right = sibling;
            }
            node = hash(left, right, false);
        }
    }
    node
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

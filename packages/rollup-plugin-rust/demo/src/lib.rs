use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub fn greet(name: &str) {
    console_error_panic_hook::set_once();

    console::log_1(&JsValue::from(&format!("Hello, {}!", name)));
}

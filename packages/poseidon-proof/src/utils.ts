/**
 * Secure method to check if the environment is Node.js.
 * @returns true if the environment is Node.js, false otherwise.
 */
export function isNode(): boolean {
    // Checking the existence of 'window' variable, or 'process' is not enough,
    // as those variables can be redefined by inner scopes (by any module/library).
    // In the 'new Function()' constructor, the execution scope of 'this' is bound
    // to the global scope and it can be compared to the expected value (the objects
    // will have the same id if the environment is the expected one).
    return new Function("try {return this===global}catch(e){ return false}")()
}

/**
 * Secure method to check if the environment is a browser.
 * @returns true if the environment is a browser, false otherwise.
 */
export function isBrowser(): boolean {
    return new Function("try {return this===window}catch(e){ return false}")()
}

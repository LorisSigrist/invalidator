
/** Causes any callbacks registered in  `depends` with the same key to be called  */
export function invalidate(key: string) : void

/** 
 * Registers a callback that gets called whenever `invalidate` gets called with the same key
 * @param key The key to listen for, or a function that takes a key and returns true/false if this dependency matches
 * @returns An unsubscribe function
*/
export function depends(matcher_or_key: string | ((key: string) => boolean), callback: () => any ) : () => void
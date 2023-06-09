
/** Causes any callbacks registered in  `depends` with the same key to be called  */
export function invalidate(key: string) : void

/** 
 * Registers a callback that gets called whenever `invalidate` gets called with the same key 
 * @returns An unsubscribe function
*/
export function depends(key: string, callback: () => any ) : () => void
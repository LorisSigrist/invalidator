/** @type {BroadcastChannel | null} */
let bc = null;

if ("BroadcastChannel" in globalThis) {
  bc = new BroadcastChannel("package:invalidator");
}

/** @type {((key: string) => boolean)[]} */
const cb_matchers = [];
const cbs = [];

/** @param {string} key */
function invalidate(key) {
  //Dispatch a message to all other tabs, if possible
  if (bc) {
    bc.postMessage(key);
  }

  const matched_indexes = [];
  for(const matcher of cb_matchers) {
    if(matcher(key)) {
      matched_indexes.push(cb_matchers.indexOf(matcher));
    }
  }

  for(const index of matched_indexes) {
    if(cbs[index] === undefined) continue;
    cbs[index]();
  }
}

/**
 *
 * @param {string | ((key: string) => boolean)} matcher_or_key
 * @param {()=>any} cb
 * @returns
 */
function depends(matcher_or_key, cb) {

  //If the key is not a function, make it a function that checks if the key is equal to the passed key
  /** @type {(key: string) => boolean } */
  const matcher = typeof matcher_or_key === "function" ? matcher_or_key : (key) => key === matcher_or_key;


  //Add the matcher and callback to the list of matchers and callbacks
  cb_matchers.push(matcher);
  cbs.push(cb);

  //Listen for messages from other tabs
  /** @param {MessageEvent<string>} e */
  function handle_message(e) {
    if (matcher(e.data)) {
      cb();
    }
  }

  if (bc) {
    bc.addEventListener("message", handle_message);
  }

  return () => {
    //remove the event listener
    if (bc) {
      bc.removeEventListener("message", handle_message);
    }

    //remove the matcher and callback from the list
    const index = cb_matchers.indexOf(matcher);
    if(index === -1) return; 
    
    cb_matchers.splice(index, 1);
    cbs.splice(index, 1);
  };
}

export { invalidate, depends };

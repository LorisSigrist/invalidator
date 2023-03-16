/** @type {BroadcastChannel | null} */
let bc = null;

if ("BroadcastChannel" in globalThis) {
  bc = new BroadcastChannel("package:invalidator");
}

/** @type {Map<string, ()=>any>} */
const cb_map = new Map();

/** @type {Map<string, Array<string>>} */
const cb_ids = new Map();

/** @param {string} key */
function invalidate(key) {
  //Dispatch a message to all other tabs, if possible
  if (bc) {
    bc.postMessage(key);
  }

  const callback_ids = cb_ids.get(key) ?? [];
  const callbacks = callback_ids.map((id) => cb_map.get(id));

  if (callbacks) {
    for (const cb of callbacks) {
      if (cb === undefined) continue;
      cb();
    }
  }
}

function depends(key, cb) {
  const id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Add the id to the list of ids for this key
  const cb_ids_array = cb_ids.get(key) ?? [];
  cb_ids_array.push(id);
  cb_ids.set(key, cb_ids_array);

  cb_map.set(id, cb);


  //Listen for messages from other tabs
  /** @param {MessageEvent<string>} e */
  function handle_message(e) {
    if (e.data === key) {
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

    //remove the id from the list of ids for this key
    let ids = cb_ids.get(id) ?? [];
    ids = ids.filter((i) => i !== id);
    cb_ids.set(id, ids);

    //remove the callback from the map
    cb_map.delete(id);
  };
}

export { invalidate, depends };

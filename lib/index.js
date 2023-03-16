/** @type {BroadcastChannel | null} */
let bc = null;

if ("BroadcastChannel" in globalThis) {
  bc = new BroadcastChannel("package:invalidator");
}

/** @type {Map<string, Array<()=>any>>} */
const cb_map = new Map();

/** @param {string} key */
function invalidate(key) {
  const callbacks = cb_map.get(key);

  if (bc) {
    bc.postMessage(key);
  }

  if (callbacks) {
    for (const cb of callbacks) {
      cb();
    }
  }
}

function depends(key, cb) {
  const new_cb_array = cb_map.get(key) ?? [];
  new_cb_array.push(cb);
  cb_map.set(key, new_cb_array);


    function handle_message(e) {
        if (e.data === key) {
            cb();
        }
    }

    if (bc) {
        bc.addEventListener("message", handle_message);
    }

  return () => {
    const cb_array = cb_map.get(key)?.filter((cb) => cb !== undefined) ?? [];

    if (cb_array.length === 0) {
      cb_map.delete(key);
      return;
    }

    cb_map.set(key, cb_array);


    if(bc) {
        bc.removeEventListener("message", handle_message);
    }
  };
}

export { invalidate, depends };

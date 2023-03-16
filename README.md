# Invalidator
Invalidator is a **tiny** (seriously it's like 10 lines) utility that allows you to define dependencies globally, even accross tabs. This is for example useful for when you want to invalidate stuff that depends on the browser cache.

## Usage
First install it:
```bash
npm i invalidator
```

Then use it:
```javascript
import { invalidate, depends } from 'invalidator';

// Define a dependency
depends('my-key', () => {
  console.log('This will be called when you invalidate the dependency');
});

// Invalidate the dependency
invalidate('my-key');

//The console will have logged
```

This invalidation even works across tabs, so if you have multiple tabs open and you invalidate a key,
that key will be invalidated in all tabs.

It internally uses `BroadcastChanel` to do this. If you want the cross-tab functionality to work in browser that don't support `BroadcastChanel` (like IE), you must use a polyfill. (Single tab functionality will still work)
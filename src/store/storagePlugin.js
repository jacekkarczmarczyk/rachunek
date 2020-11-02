const initState = ({ storage, storageKey, store }) => {
  const initial = storage.getItem(storageKey);

  if (!initial) {
    return;
  }
  const syncedData = JSON.parse(initial);

  Object.keys(store.modules).forEach(module => {
    (store.modules[module].sync || []).forEach(key => {
      if ((module in syncedData) && (key in syncedData[module])) {
        store.modules[module].state[key] = syncedData[module][key];
      }
    });
  });
};

export default ({ storage, storageKey, store }) => {
  initState({
    store,
    storageKey,
    storage,
  });
  if (!store.plugins) {
    store.plugins = [];
  }
  const modules = Object.keys(store.modules);
  const syncProperties = {};
  const storageData = {};

  modules.forEach(module => {
    syncProperties[module] = store.modules[module].sync;
    storageData[module] = {};
  });
  store.plugins.push(s => s.subscribe((mutation, state) => {
    modules.forEach(module => {
      syncProperties[module].forEach(key => {
        storageData[module][key] = state[module][key];
      });
    });
    storage.setItem(storageKey, JSON.stringify(storageData));
  }));

  return store;
};
// # sourceMappingURL=storagePlugin.js.map

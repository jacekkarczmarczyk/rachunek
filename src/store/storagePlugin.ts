const initState = ({
  store,
  storageKey,
  storage,
}: any) => {
  const initial = storage.getItem(storageKey);

  if (!initial) {
    return;
  }

  const syncedData = JSON.parse(initial);

  Object.keys(store.modules).forEach(module => {
    (store.modules[module].sync || []).forEach((key: any) => {
      if ((module in syncedData) && (key in syncedData[module])) {
        store.modules[module].state[key] = syncedData[module][key];
      }
    });
  });
};

export default ({
  store,
  storageKey,
  storage,
}: any) => {
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
    (syncProperties as any)[module] = store.modules[module].sync;
    (storageData as any)[module] = {};
  });

  store.plugins.push((s: any) => s.subscribe((mutation: any, state: any) => {
    modules.forEach(module => {
      (syncProperties as any)[module].forEach((key: any) => {
        (storageData as any)[module][key] = state[module][key];
      });
    });

    storage.setItem(storageKey, JSON.stringify(storageData));
  }));

  return store;
};

const initState = ({
  storage,
  storageKey,
  store,
}: any) => {
  const initial: string = storage.getItem(storageKey);

  if (!initial) {
    return;
  }

  const syncedData = JSON.parse(initial);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  Object.keys(store.modules).forEach(module => {
    (store.modules[module].sync || []).forEach((key: any) => {
      if ((module in syncedData) && (key in syncedData[module])) {
        store.modules[module].state[key] = syncedData[module][key];
      }
    });
  });
};

export default ({
  storage,
  storageKey,
  store,
}: any) => {
  initState({
    store,
    storageKey,
    storage,
  });

  if (!store.plugins) {
    store.plugins = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

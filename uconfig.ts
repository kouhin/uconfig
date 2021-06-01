const KEY = '__INIT_UCONFIG__';

export interface RuntimeConfig {
  [key: string]: string | undefined;
}

export interface RuntimeConfigSetting {
  publicRuntimeConfig: RuntimeConfig;
  serverRuntimeConfig: RuntimeConfig;
}

declare const window: Window & {
  [KEY]: RuntimeConfig | undefined;
};

let settings: RuntimeConfigSetting = {
  publicRuntimeConfig: {},
  serverRuntimeConfig: {},
};

let config: RuntimeConfig;

function canUseDOM(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.document &&
    !!window.document.createElement
  );
}

function load() {
  if (!canUseDOM()) return;
  if (KEY in window) {
    const c = window[KEY];
    config = typeof c === 'object' ? c : JSON.parse(c || '{}');
  }
}

function withProxy(target: RuntimeConfig) {
  return new Proxy(target, {
    get(target, prop) {
      if (prop in target && typeof prop === 'string') return target[prop];
      throw new ReferenceError(`${String(prop)} is not defined`);
    },
  });
}

export function getConfig(): RuntimeConfig {
  if (!config && canUseDOM()) {
    load();
  }
  return config;
}

export function initConfig(
  v: RuntimeConfigSetting,
  throwErrorOnAbsent: boolean | undefined = false
) {
  if (canUseDOM())
    throw new Error('initConfig() is not available on client side');
  settings = v;
  const c: RuntimeConfig = {
    ...settings.publicRuntimeConfig,
    ...settings.serverRuntimeConfig,
  };
  config = throwErrorOnAbsent ? withProxy(c) : c;
}

export function getConfigSettings(): RuntimeConfigSetting {
  return settings;
}

export function serializePublicRuntimeConfig() {
  return `window.${KEY}=${JSON.stringify(
    JSON.stringify(settings.publicRuntimeConfig)
  )};`;
}

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

export function getConfig(): RuntimeConfig {
  if (!config && canUseDOM()) {
    load();
  }
  return config;
}

export function initConfig(v: RuntimeConfigSetting) {
  if (canUseDOM())
    throw new Error('initConfig() is not available on client side');
  settings = v;
  config = {
    ...settings.publicRuntimeConfig,
    ...settings.serverRuntimeConfig,
  };
}

export function getConfigSettings(): RuntimeConfigSetting {
  return settings;
}

export function serializePublicRuntimeConfig() {
  return `window.${KEY}=${JSON.stringify(
    JSON.stringify(settings.publicRuntimeConfig)
  )};`;
}

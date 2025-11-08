let _config = {};

export async function loadRuntimeConfig() {
  const res = await fetch('/env.js');
  const script = await res.text();
  const el = document.createElement('script');
  el.textContent = script;
  document.head.appendChild(el);

  _config = window.ENV;
  return _config;
}

export function getConfig() {
  return _config;
}

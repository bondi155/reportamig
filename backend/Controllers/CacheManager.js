// cacheManager.js
let cacheDatosTotal = {};

function limpiarCache() {
  cacheDatosTotal = {};
  console.log('Caché limpiada.');
}

function getCache() {
  return cacheDatosTotal;
}

function updateCache(id, datos) {
  cacheDatosTotal[id] = datos;
}

module.exports = {
  limpiarCache,
  getCache,
  updateCache
};

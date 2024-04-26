// cacheManager.js

function getSizeOfObject(obj) {
  const str = JSON.stringify(obj);
  return Buffer.byteLength(str, 'utf8');
}

function showCacheSize() {
  const totalSize = getSizeOfObject(cacheDatosTotal);
  console.log(`Total Cache Size: ${totalSize} bytes`);
  console.log(`Total Cache Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

let cacheDatosTotal = {};
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10 MB de límite para tus pruebas

function limpiarCache() {
  cacheDatosTotal = {};
  console.log('Caché limpiada.');
}

function getCache(id, mes, anio) {
  const cacheKey = `${id}-${mes}-${anio}`;
  const cachedData = cacheDatosTotal[cacheKey];
  return cachedData;
}

function evictCache() {
  let keys = Object.keys(cacheDatosTotal);
  keys.sort((a, b) => cacheDatosTotal[a].lastAccessed - cacheDatosTotal[b].lastAccessed);
  if (keys.length > 0) {
    console.log('Evicting:', keys[0]);
    delete cacheDatosTotal[keys[0]]; // Elimina la entrada más antigua
  }
}

function updateCache(id, datos, mes, anio) {
  // Crear una clave única para cada combinación de id, mes y año
  const cacheKey = `${id}-${mes}-${anio}`;

  // Agrega el nuevo elemento con la clave única
  if (!cacheDatosTotal[cacheKey]) {
    cacheDatosTotal[cacheKey] = { data: datos, lastAccessed: Date.now() };
  } else {
    // Si ya existe, simplemente actualiza los datos y el tiempo de último acceso
    cacheDatosTotal[cacheKey].data = datos;
    cacheDatosTotal[cacheKey].lastAccessed = Date.now();
  }

  // Verificar el tamaño del caché y limpiar si es necesario
  let newSize = getSizeOfObject(cacheDatosTotal);
  while (newSize > MAX_CACHE_SIZE && Object.keys(cacheDatosTotal).length > 0) {
    evictCache();
    newSize = getSizeOfObject(cacheDatosTotal);
  }

  console.log(`Cache updated. Total keys: ${Object.keys(cacheDatosTotal).length}`);
  console.log(`Approximate size of cache: ${newSize} bytes`);
  showCacheSize();
}
/* Para Probar cache 

function generateData(sizeInKB) {
  let result = '';
  for (let i = 0; i < sizeInKB * 1024; i++) {
      result += 'x'; // Añadir un caracter simple para alcanzar el tamaño deseado
  }
  return result;
}
S
// Simular la inserción de datos en el caché
function simulateCacheFilling() {
  let keyIndex = 1;
  let dataSizeKB = 1024; // Comienza con 1 MB por entrada

  while (true) {
      const data = generateData(dataSizeKB);
      updateCache(`key${keyIndex}`, { data: data, lastAccessed: Date.now() });

      // Aumentar la clave y el tamaño para la próxima iteración
      keyIndex++;
      dataSizeKB *= 2; // Doblar el tamaño de los datos para la próxima entrada

      if (keyIndex > 5) break; // Limitar el número de entradas para no bloquear el navegador/consola
  }
}

simulateCacheFilling();*/
  
module.exports = {
  limpiarCache,
  getCache,
  updateCache
};

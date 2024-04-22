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

function getCache() {
  return cacheDatosTotal;
}

function evictCache() {
  let keys = Object.keys(cacheDatosTotal);
  // Ordena por el tiempo de último acceso (suponiendo que guardamos esta información)
  keys.sort((a, b) => cacheDatosTotal[a].lastAccessed - cacheDatosTotal[b].lastAccessed);

  if (keys.length > 0) {
    console.log('Evicting:', keys[0]);
    delete cacheDatosTotal[keys[0]]; // Elimina la entrada más antigua
  }
}

function updateCache(id, datos) {
  // Agrega el nuevo elemento temporalmente para calcular el tamaño correcto
  cacheDatosTotal[id] = datos;
  cacheDatosTotal[id].lastAccessed = Date.now(); // Actualizar el tiempo de último acceso

  let newSize = getSizeOfObject(cacheDatosTotal);
  while (newSize > MAX_CACHE_SIZE && Object.keys(cacheDatosTotal).length > 0) {
      evictCache(); // Elimina una entrada si estamos sobre el límite
      newSize = getSizeOfObject(cacheDatosTotal); // Recalcular el tamaño después de cada evicción
  }

  console.log(`Cache updated. Total keys: ${Object.keys(cacheDatosTotal).length}`);
  console.log(`Approximate size of cache: ${newSize} bytes`);
  showCacheSize();  // Muestra el tamaño actual del caché en formato legible
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

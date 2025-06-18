/**
 * Crea la configuración HTTP para peticiones API
 * @param {number} timeout - Tiempo máximo de espera en ms
 * @returns {object} Configuración para axios
 */
function createHttpConfig(timeout) {
  // Versión compatible sin usar el operador de encadenamiento opcional ?.
  const token = global.activeUser && global.activeUser.token ? global.activeUser.token : '';
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: timeout
  };
}

export default createHttpConfig;
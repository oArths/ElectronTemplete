const path = require("path");
const fs = require("fs");
const { app } = require("electron");

/**
 * userUtils.js
 * 
 * This file contains utility functions related to user operations.
 * 
 * Author: Joaquín Ayala
 * Email: joaquin.ayala.c@gmail.com
 * 
 * Functions:
 * - saveActiveUser(): Saves the active user information to a file.
 * - loadActiveUser(): Loads the active user information from a file.
 * - ensureUserDirectoryExists(): Ensures that the directory for user data exists.
 */

// Obtener la ruta correcta para los datos de usuario
function getUserDataPath() {
  // Usar la ruta correcta según configuración del proyecto
  return path.join(app.getPath("userData"), "kyrios");
}

// Asegurar que el directorio existe
function ensureUserDirectoryExists() {
  const userDir = getUserDataPath();
  if (!fs.existsSync(userDir)) {
    try {
      fs.mkdirSync(userDir, { recursive: true });
      console.log(`Directorio creado: ${userDir}`);
    } catch (err) {
      console.error(`Error al crear directorio ${userDir}:`, err);
    }
  }
}

/**
 * Saves the active user information to a file.
 */
function saveActiveUser() {
  try {
    // console.log("Guardando usuario activo");
    ensureUserDirectoryExists();
    
    const userDataPath = path.join(getUserDataPath(), "activeUser.json");
    fs.writeFileSync(userDataPath, JSON.stringify(global.activeUser));
    // console.log("Usuario guardado exitosamente en:", userDataPath);
  } catch (error) {
    console.error("Error al guardar usuario activo:", error);
  }
}

/**
 * Loads the active user information from a file.
 * @returns {Object} The active user information or default user object if file doesn't exist.
 */
function loadActiveUser() {
  try {
    ensureUserDirectoryExists();
    const userDataPath = path.join(getUserDataPath(), "activeUser.json");
    
    if (!fs.existsSync(userDataPath)) {
      const defaultUser = { email: null, loggedIn: false };
      fs.writeFileSync(userDataPath, JSON.stringify(defaultUser));
      return defaultUser;
    }
    
    const data = fs.readFileSync(userDataPath);
    return JSON.parse(data);
  } catch (error) {
    return { email: null, loggedIn: false };
  }
}

/**
 * Initializes the user file system.
 * Call this function early in the app lifecycle.
 */
function initUserFileSystem() {
  try {
    ensureUserDirectoryExists();
    const userDataPath = path.join(getUserDataPath(), "activeUser.json");
    
    if (!fs.existsSync(userDataPath)) {
      const defaultUser = { email: null, loggedIn: false };
      fs.writeFileSync(userDataPath, JSON.stringify(defaultUser));
      console.log("Archivo de usuario inicializado en:", userDataPath);
    }
  } catch (error) {
    console.error("Error al inicializar sistema de archivos de usuario:", error);
  }
}

module.exports = {
  saveActiveUser,
  loadActiveUser,
  initUserFileSystem
};
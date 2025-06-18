const { createProtocol } = require("vue-cli-plugin-electron-builder/lib");

/**
 * loadWindowUrl.js
 * 
 * This file contains a utility function to load the URL for a BrowserWindow instance.
 * 
 * Author: Joaquín Ayala
 * Email: joaquin.ayala.c@gmail.com
 * 
 * Functions:
 * - loadWindowUrl(window): Loads the appropriate URL for the given BrowserWindow instance.
 */

/**
 * Loads the appropriate URL for the given BrowserWindow instance.
 * @async
 * @param {BrowserWindow} window - The BrowserWindow instance to load the URL into.
 * @returns {Promise<void>}
 * @throws {Error} If there is an error loading the URL.
 */
async function loadWindowUrl(window) {
  let baseUrl = "";

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the URL of the dev server if in development mode
    baseUrl = process.env.WEBPACK_DEV_SERVER_URL;
    await window.loadURL(baseUrl);
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    baseUrl = "app://./index.html/";
    await window.loadURL(baseUrl);
  }
}

module.exports = loadWindowUrl;
const { BrowserWindow } = require("electron");

/**
 * loadRouterURL.js
 * 
 * This file contains a function to load a specific URL into the router.
 * 
 * Author: Joaquín Ayala
 * Email: joaquin.ayala.c@gmail.com
 * 
 * Functions:
 * - loadRouterURL(window, url): Loads the specified URL into the router.
 */

/**
 * Loads the specified URL into the router.
 * @param {BrowserWindow} window - The BrowserWindow instance to load the URL into.
 * @param {string} url - The URL to load into the router.
 * @throws {Error} If the window is not an instance of BrowserWindow.
 */
async function loadRouterURL(window, url) {
  if (!(window instanceof BrowserWindow)) {
    throw new Error("The window parameter must be an instance of BrowserWindow.");
  }

  await window.webContents.executeJavaScript(`
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      window.router.push("${url}");
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        window.router.push("${url}");
      });
    }
  `);
}

module.exports = loadRouterURL;
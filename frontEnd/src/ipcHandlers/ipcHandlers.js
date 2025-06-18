import { BrowserWindow, ipcMain, screen, app } from "electron";
import { shell } from "electron";
import { encryption } from "./../ipcHandlers/utils";
import axios from "axios";

const loadRouterURL = require("../utils/loadRouterURL");
const loadWindowUrl = require("../utils/loadWindow");
var photoPanel = null;

function loadIpcCalls() {
	require("./queryHandlers/ipcLogin.js");

	// IPC handler to open a URL in the default browser
	ipcMain.on("open-url", async (event, url) => {
		try {
			await shell.openExternal(url);
		} catch (error) {
			console.error("Failed to open URL:", error);
		}
	});

	ipcMain.on("zoom", (event, value) => {
		try{
			BrowserWindow.getAllWindows().forEach((win) => {
				win.webContents.setZoomFactor(value);
			});
			event.reply("zoom-response", true);
		}catch {
			event.reply("zoom-response-error", false);
		}
	});

	ipcMain.on("get-window-name", async (event) => {
		try {
			if(!global.activeUser.email) {
				event.reply("get-window-name-response", "Kyrios - " + process.env.VERSION);
				return;
			}
			
			const windowTitle =
				"Kyrios - " + global.activeUser.email + " " + process.env.VERSION;

			event.reply("get-window-name-response", windowTitle);
		} catch (error) {
			console.log("Failed to get window name:", error);
		}
	});

	ipcMain.on("get-version", async (event) => {
		try {
			event.reply("get-version-response", process.env.VERSION);
		} catch (error) {
			console.log("Failed to get version:", error);
		}
	});


	ipcMain.on("get-personas", async (event, params) => {
		try {
				

			const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");
			
			event.reply("get-personas-response", response.data);

		}catch (error) {
			console.error("Failed to get personas:", error);
			event.reply("get-personas-error", { success: false, error: error.message });
		}
	});

	// Add more IPC handlers as needed
}

// Export the function to load IPC calls
export default loadIpcCalls;
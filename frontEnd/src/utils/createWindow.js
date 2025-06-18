import { BrowserWindow, screen, ipcMain, app } from "electron";
import validaAPI from "@/login/login";
import loadWindowUrl from "../utils/loadWindow";
import loadRouterURL from "./loadRouterURL";
import { saveActiveUser } from "../utils/userUtils";
import { join } from "path";
/**
 * createLoginWindow.js
 *
 * This file contains the function to create the login window.
 *
 * Author: Joaquín Ayala
 * Email: joaquin.ayala.c@gmail.com
 *
 * Functions:
 * - createLoginWindow(): Creates and manages the login window.
 */

/**
 * Creates and manages the login window.
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If there is an error creating the login window.
 */
async function createWindow() {
	// Get the dimensions of the primary display's work area
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	// Define the width and height of the login window
	const windowWidth = Math.min(1000, width);
	const windowHeight = Math.min(700, height);

	// Configuration object for the login window
	const loginWindowConfig = {
		width: windowWidth, // Set the width of the window
		height: windowHeight, // Set the height of the window
		x: (width - windowWidth) / 2, // Center the window horizontally
		y: (height - windowHeight) / 2, // Center the window vertically
		icon: join(__dirname, "public", "icon.jpg"),
		title: "login", // Set the window title
		webPreferences: {
			nodeIntegration: true, // Enable Node.js integration
			contextIsolation: false, // Disable context isolation
			enableRemoteModule: false, // Disable remote module
			webSecurity: false, // Disable web security
		},
		frame: true, // Disable the window frame
		closable: true, // Allow the window to be closable
		autoHideMenuBar: true, // Auto-hide the menu bar
		transparent: false, // No hacer transparente
		resizable: false, // No permitir redimensionar
		movable: true, // Permitir movimiento
		backgroundColor: "#ffffff", // Fondo blanco (o el color que prefieras)
	};

	let browserWindow = await new BrowserWindow(loginWindowConfig);

	browserWindow.hide(); // Hide the window initially

	await loadWindowUrl(browserWindow);
	await loadRouterURL(browserWindow, "/login");

	browserWindow.show(); // Show the window

	// Maneja el evento de login
	ipcMain.on("login", async (event, payload) => {
		try {
			//const resultado = await validaAPI(null, payload.email, payload.password);

			// Configurar el usuario global
			global.activeUser = {
				email: payload.email,
				token: null,
				loggedIn: true,
			};

			// Guardar el usuario
			saveActiveUser(global.activeUser);

			// Notificar a todas las ventanas sobre el cambio de usuario
			BrowserWindow.getAllWindows().forEach((window) => {
				if (!window.isDestroyed()) {
					window.webContents.send("user-updated", global.activeUser);
				}
			});

			event.reply("loginResponse", {
				success: true,
				email: payload.email,
			});

			browserWindow.resizable = true;
			browserWindow.autoHideMenuBar = false;
			browserWindow.frame = true;
			browserWindow.movable = true;
			browserWindow.resizable = true;
			browserWindow.maximize();
		} catch (error) {
			console.log("Error en la validación de API:", error);
			event.reply("loginError", JSON.stringify(error));
		}
	});
}

export default createWindow;

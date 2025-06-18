const { app, protocol, dialog } = require("electron");
const installExtension = require("electron-devtools-installer").default;
const { VUEJS_DEVTOOLS } = require("electron-devtools-installer");
const loadIpcCalls = require("./ipcHandlers/ipcHandlers").default; // Ensure this import is correct
const checkVersion = require("./controller/checkVersion");
const createWindow = require("./utils/createWindow").default;
const { initUserFileSystem } = require("./utils/userUtils");
const executeApiExe = require("./utils/executeApiExe");
const killApiProcesses = require("./utils/killApiProcesses").default;
var apiProcess = null;
const testApiConnection = require("./utils/testApiConnection").default;

require("./env.js");

const isDevelopment = process.env.NODE_ENV !== "production";

global.activeUser = global.activeUser || { email: null, loggedIn: false };

protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } },
]);

global.activeDbProfile = {
	server_url: null,
	database_name: null,
};

global.activeUser = {
	email: null,
	loggedIn: false,
};

// the app can't be instanced more than once
if (!app.requestSingleInstanceLock()) {
	app.exit(0);
}


app.on("ready", async () => {
	try {
		//apiProcess = await executeApiExe.default();
		
		//let apiTestConnection = await testApiConnection();
		/*
		if(apiTestConnection !== true){
			console.error("Error al conectar a la API");

			let response = await dialog
				.showMessageBox({
					type: "error",
					title: "",
					message: "Error al conectar a la API.",
					buttons: ["Cerrar"],
				})
			
			if (response.response === 0) {
				app.quit();
			}
		}
		*/


		if (isDevelopment) {
			await installExtension(VUEJS_DEVTOOLS);
		}

		/*
		if (!(await checkVersion())) {
			let response = await dialog
				.showMessageBox({
					type: "error",
					title: "Error de Versión",
					message: "Error al verificar la versión",
					buttons: ["Cerrar"],
				})
			
			if (response.response === 0) {
				app.quit();
			}

			return;
		}
		*/

		initUserFileSystem();
		loadIpcCalls();

		await createWindow();
	} catch (error) {
		dialog
			.showMessageBox({
				type: "error",
				title: "Error",
				message: "Error inesperado: " + error.message,
				buttons: ["Cerrar"],
			})
			.then(() => {
				app.quit();
			});
	}
});

app.on("window-all-closed", () => {

	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("before-quit", async () => {
	try {
     	killApiProcesses("fastapi_app.exe");
	} catch (error) {
		console.error("Error al cerrar conexiones:", error);
	}
});

if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit();
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
		});
	}
}

//desarrollado por Joaquín Ayala, 2025. joaquin.ayala.c@gmail.com

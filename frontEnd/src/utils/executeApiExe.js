import { spawn } from "child_process";
import path from "path";
import { app, dialog } from "electron";
import ProgressBar from "electron-progressbar";
import fs from "fs";
import c from "ansi-colors";

function createLoadingBar() {
	const progressBar = new ProgressBar({
		indeterminate: false,
		text: "Starting API",
		detail: "Please wait...",
	});

	return progressBar;
}

function handleTerminalMessages(
	data,
	progressBar,
	callback
) {
	try {
		if (!data.toString().includes("Uvicorn running on")) {
			progressBar.value = progressBar.value + 10;
			progressBar.detail = "Starting server process";
		}

		if (data.toString().includes("Started server process")) {
			progressBar.value = 50;
			progressBar.detail = "Server process started";
		}

		if (data.toString().includes("Uvicorn running on")) {
			// within this data.toString we have a url starting with http:// . assign it to a variable
			const url = data.toString().match(/http:\/\/[^\s]+/)[0];
			process.env.VUE_APP_API_URL = url;
            console.log(c.bgBlue(`VUE_APP_API_URL set to: ${process.env.VUE_APP_API_URL}`));

			progressBar.value = 100;
			progressBar.detail = "API started successfully";
			progressBar.setCompleted();
			callback(); // Resolve the Promise here
			
		}
	} catch (error) {
		throw error;
	}
}

async function executeApiExe() {

	const isDevelopment = process.env.NODE_ENV === "development";

	if (isDevelopment) {
		return;
	}

	return new Promise((resolve, reject) => {
		try {
			const resourcesPath = process.resourcesPath; // Production: resources folder
			var progressBar = createLoadingBar();

			// Check if the resources folder exists
			if (!fs.existsSync(resourcesPath)) {
				throw new Error(`Resources folder not found at path: ${resourcesPath}`);
			}

			const exeFile = 'fastapi_app.exe';
			const exePath = path.join(resourcesPath, exeFile);

			// Spawn the process
			const apiProcess = spawn(exePath, {
				shell: true,
			});

			// Monitor stderr (standard error)
			apiProcess.stderr.on("data", (data) => {
				handleTerminalMessages(
					data,
					progressBar,
					() => resolve(apiProcess) // Pass a function that resolves the Promise
				);
			});

			apiProcess.on("error", (error) => {
				throw error;
			});
		} catch (error) {
			progressBar.close();

			setTimeout(() => {
				dialog
					.showMessageBox({
						type: "error",
						title: "Error",
						message: `Error executing .exe file: ${error.message}`,
						buttons: ["OK"],
					})
					.then(() => {
						app.quit();
					});
				reject(error); // Reject the Promise on general error
			}, 500);
		}
	});
}

export default executeApiExe;

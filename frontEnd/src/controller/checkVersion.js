const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dialog = require("electron").dialog;
const axios = require("axios").default;
const c =  require("ansi-colors");
/**
 * Verifica la versión de la aplicación contra la base de datos.
 */
const checkVersion = async () => {
	try {
		// Configurar la solicitud HTTP con el token JWT
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const response = await axios.get(
			`${process.env.VUE_APP_API_URL}/load/version`,
			null,
			config
		);

		const Version = response.data.Version;

		if (process.env.VERSION === Version) {
			console.log(
				c.green("Version check passed: ") +
					c.yellow(process.env.VERSION) +
					c.green(" is the same version ") +
					c.yellow(Version)
			);
			return true;
		}

		return false;
	} catch (error) {
		return false;
	}
};

module.exports = checkVersion;
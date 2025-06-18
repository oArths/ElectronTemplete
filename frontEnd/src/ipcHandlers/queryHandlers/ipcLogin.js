import { ipcMain } from "electron";
import { loadActiveUser } from "../../utils/userUtils";
import c from "ansi-colors"
require("dotenv").config(); // Load environment variables

global.activeUser = {
  email: null,
  loggedIn: false,
};


const ipcHandlers = {
  "checkLogin": async (event) => {
    try {
      event.reply("checkLoginResponse", global.activeUser);
    } catch (error) {
      event.reply("error", { error: error.message });
    }
  },
  "logout": async (event) => {
    try {
      global.activeUser = {
        email: null,
        loggedIn: false,
      };

      event.reply("checkLoginResponse", global.activeUser);
    } catch (error) {
      event.reply("error", { error: error.message });
    }
  },
  "getUserInfo": async (event) => {
    try {
      // No lanzar error, simplemente enviar un objeto de usuario predeterminado
      if (!global.activeUser || !global.activeUser.loggedIn) {
        event.reply("user-info-updated", { email: null, loggedIn: false });
        return;
      }
      
      // Si hay usuario autenticado, enviar su información
      event.reply("user-info-updated", global.activeUser);
    } catch (error) {
      // console.error("Error al obtener información del usuario:", error);
      event.reply("error", { error: error.message });
    }
  },
  "retrieve-last-user": async (event) => {
    try {
      event.reply("retrieve-last-user-response", loadActiveUser());
    } catch (error) {
      event.reply("error", { error: error.message });
    }
  },
  "getEmailOnly": async (event) => {
    try {
      // Devolver el email directamente desde global.activeUser
      const email = global.activeUser && global.activeUser.email ? global.activeUser.email : null;
      event.reply('emailResponse', email);
    } catch (error) {
      event.reply('emailResponse', null);
    }
  }
}

Object.entries(ipcHandlers).forEach(([key, handler]) => {
  ipcMain.on(key, handler);
  console.log(c.green(`Registered ipc handler for ${key}`));
});

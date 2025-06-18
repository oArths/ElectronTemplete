<template>
  <v-form ref="form" class="login-form" @submit.prevent>
    <div class="drag-handle"></div>
    <v-container class="pa-0 ma-0 container-fluid" fluid>
      <v-row class="pa-0 ma-0 main-row" no-gutters align-content="stretch">
        <!-- Columna izquierda: Formulario de Login -->
        <v-col cols="12" md="6" class="h-100 d-flex align-center justify-center pa-0 form-column">
          <v-card class="elevation-0 pa-sm-12 pa-md-16" :style="{ width: '100%', maxWidth: '550px' }">
            <v-card-title class="text-h4 font-weight-bold mb-8 text-center">
              Sign In
            </v-card-title>

            <v-card-text class="h-50 pl-3 pr-3">
              <v-text-field label="Email" v-model="email" :rules="emailRules" />
              <v-text-field label="Password" v-model="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'" @click:append="togglePasswordVisibility" outlined
                :rules="passwordRules" />
              <v-checkbox v-model="rememberMe" label="Remember me" class="mt-5" />
            </v-card-text>

            <v-card-actions class="pb-1 d-flex flex-column">
              <v-btn class="bg-primary
               w-100" @click="login" type="submit" :loading="loading" :disabled="!isFormValid">Login</v-btn>
              <v-btn class="bg-red w-100" @click="salir">Exit</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Columna derecha: Branding -->
        <v-col cols="12" md="6" class="h-100 d-none d-md-flex align-center justify-center pa-0 branding-column">
          <div class="text-center pa-10">
            <img :src="logoKantar" alt="Kantar" style="max-width: 350px; width: 100%; height: auto;">
          </div>
          <p style="position:absolute; bottom: 20px; right: 20px; color: #FFFFFF; font-size: 0.9em; opacity: 0.8;">
            Build: {{ version }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer;

export default {
  name: 'LoginView',
  mounted() {
    this.getLastUserEmail();
    this.getVersion();
  },
  beforeDestroy() {
    // No olvidar quitar el listener al desmontar
    if (ipcRenderer) {
      ipcRenderer.removeAllListeners("error");
    }
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      rememberMe: false,
      showErrorLabel: false,
      showSuccessLabel: false,
      errorMessage: '',
      logoKantar: require('@/assets/KANTAR_W.png'),
      version: "loading...",
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
    };
  },
  computed: {
    isFormValid() {
      if (!this.email || !this.password) return false;
      return this.emailRules.every(rule => rule(this.email) === true) &&
        this.passwordRules.every(rule => rule(this.password) === true);
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async login() {

      if (this.loading) {
        return;
      }

      this.loading = true;
      this.showSuccessLabel = false;
      this.showErrorLabel = false;
      this.$ipcRequest(
        "login",
        "loginResponse",
        "loginError",
        {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe,
        },
        () => {
          this.showSuccessLabel = true;
          this.$router.push('/'); // Asegúrate de que esta ruta coincide con router.js
          this.loading = false;
        },
        (error) => {
          this.showErrorLabel = true;
          this.errorMessage = error;
          this.loading = false;
        }
      );
    },
    salir() {
      ipcRenderer.send('salir');
    },
    async getLastUserEmail() {
      const user = await new Promise((resolve) => {
        ipcRenderer.once('retrieve-last-user-response', (event, retrievedUser) => {
          resolve(retrievedUser);
        });
        ipcRenderer.send('retrieve-last-user');
      });

      if (user && user.email) {
        this.email = user.email;
      }
    },
    getVersion() {
      ipcRenderer.send('get-version');
      ipcRenderer.once('get-version-response', (event, version) => {
        this.version = version;
      });
    }
  }
};
</script>

<style>
/* Estos estilos NO llevan scoped para que puedan afectar elementos fuera del componente */
body,
html,
#app {
  overflow: hidden !important;
  height: 100vh !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<style scoped>
.drag-handle {
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  z-index: 9999;
}

/* Apply dark background to the entire login form area */
.login-form, .container-fluid, .main-row {
  height: 100vh !important;
  width: 100vw !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Form Column - CAMBIO A BLANCO */
.form-column {
  background-color: #FFFFFF !important; /* Fondo blanco para la columna del formulario */
}

/* Dark Branding Column - SE MANTIENE OSCURA */
.branding-column {
  background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%); /* Dark gradient */
  position: relative; 
  overflow: hidden; 
}

/* Asegurarnos que las columnas y cards también respetan el overflow */
.v-col,
.v-card {
  overflow: hidden !important;
}

/* Ribbon - SE MANTIENE IGUAL */
.branding-column::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 12px; 
  height: 100%;
  background-color: #FFD700; 
  z-index: 1; 
}

.branding-column .text-center { 
  position: relative;
  z-index: 2;
}

.branding-column p { 
  color: #E0E0E0 !important; 
  opacity: 0.7;
  position: relative; 
  z-index: 2;
}

/* Adjust v-card in form-column for LIGHT THEME */
.form-column .v-card {
  background-color: #FFFFFF !important; /* Fondo blanco para la tarjeta */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important; /* Sombra sutil para la tarjeta */
  border-radius: 8px; /* Opcional: esquinas redondeadas */
}

/* Adjust text color for card title and labels in LIGHT THEME */
.form-column .v-card-title {
  color: #333333 !important; /* Color de texto oscuro para el título */
}
:deep(.form-column .v-label) {
  color: #555555 !important; /* Color de texto oscuro para etiquetas */
  opacity: 1; 
}
:deep(.form-column .v-field__input) {
  color: #333333 !important; /* Color de texto oscuro para el input */
}
:deep(.form-column .v-checkbox .v-label) {
  color: #555555 !important; /* Color de texto oscuro para etiqueta de checkbox */
}

/* Login Button - AJUSTES PARA FONDO CLARO (si es necesario, o mantener el naranja) */
.login-button {
  background-color: #FF5722 !important; /* Naranja se mantiene bien sobre blanco */
  color: white !important;
  font-size: 1.1rem;
  letter-spacing: 1px;
  height: 52px !important;
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3) !important; 
  transition: all 0.3s ease !important;
}

.login-button:hover {
  background-color: #FF8C00 !important;
  box-shadow: 0 6px 14px rgba(255, 87, 34, 0.4) !important;
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(255, 87, 34, 0.3) !important;
}

.login-button:disabled {
  background-color: rgba(255, 87, 34, 0.5) !important; /* Naranja más claro para deshabilitado */
  color: rgba(255, 255, 255, 0.7) !important;
  box-shadow: none !important;
}

/* Style for the Exit button in LIGHT THEME */
.form-column .v-btn[variant="outlined"] {
  border-color: #CCCCCC; /* Borde gris claro */
  color: #555555;     /* Texto gris oscuro */
}

.form-column .v-btn[variant="outlined"]:hover {
  background-color: #F5F5F5; /* Fondo gris muy claro al pasar el mouse */
  border-color: #BBBBBB;
}

/* Adjust text field outlines and icons for LIGHT THEME */
:deep(.form-column .v-text-field .v-field__outline .v-icon),
:deep(.form-column .v-text-field .v-field__prepend-inner .v-icon),
:deep(.form-column .v-text-field .v-field__append-inner .v-icon) {
  color: #777777 !important; /* Iconos gris medio */
}
:deep(.form-column .v-field--focused .v-field__outline) {
  color: #FF5722 !important; /* Color de acento naranja al enfocar */
}
</style>

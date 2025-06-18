import { createApp } from 'vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './utils/polyfills';
import SplitPane from 'split-pane-v3';
import "./assets/variables.css";
import ipcPlugin from '@/plugins/ipcPlugin';

import VueEasyLightbox from 'vue-easy-lightbox'
import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css'

import { plugin as vueTransitionsPlugin } from '@morev/vue-transitions';
import '@morev/vue-transitions/styles';
// you need to import css file

// o
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'

//import the router
import router from './router/router'

// Components
import App from './App.vue'
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";

const app = createApp(App)

const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
  },
  styles: {
    configFile: "./assets/settings.scss",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
  components,
  directives,
});

// Register SplitPane globally
app.component('SplitPane', SplitPane);

// Use plugins
app.use(vueTransitionsPlugin({
  // Default duration for all transitions now is `200`
  defaultProps: {
    duration: 200,
  },
  // But for `<transition-expand>` default duration is `500`
  componentDefaultProps: {
    TransitionExpand: {
      duration: 500,
    }
  }
}));

app.use(ipcPlugin);
app.use(vuetify);
app.use(router);
app.use(VueEasyLightbox);
app.mount('#app')

window.router = router
window.ipcPlugin = ipcPlugin
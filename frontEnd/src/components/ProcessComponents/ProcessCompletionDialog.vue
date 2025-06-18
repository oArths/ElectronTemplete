<template>
  <v-dialog v-model="dialogVisible" max-width="400" persistent>
    <v-card>
      <v-card-title :class="['d-flex align-center pa-4', `bg-${statusConfig.color}-lighten-5`]">
        <v-icon :color="statusConfig.color" size="28" class="mr-2">{{ statusConfig.titleIcon }}</v-icon>
        <span class="text-h6 font-weight-bold">{{ statusConfig.title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      
      <v-card-text class="pt-4 pb-2 px-4 text-center">
        <v-icon :color="statusConfig.color" size="64" class="mb-2">{{ statusConfig.mainIcon }}</v-icon>
        <div v-if="fetchingMessage">
          <v-progress-circular indeterminate size="24" color="primary" class="mb-2"></v-progress-circular>
          <p class="text-caption">Loading process details...</p>
        </div>
        <div v-else>
          <p class="text-body-1">{{ displayMessage || statusConfig.defaultMessage }}</p>
          <p v-if="executionId" class="text-caption text-grey-darken-1 mt-2">Execution ID: {{ executionId }}</p>
        </div>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn :color="statusConfig.color" variant="elevated" @click="closeDialog" :disabled="fetchingMessage">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ProcessCompletionDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    idStatus: { type: Number, default: 5 },
    executionId: { type: String, default: null },
    customMessage: { type: String, default: null }
  },
  data() {
    return { fetchingMessage: false, displayMessage: null };
  },
  computed: {
    dialogVisible: {
      get() { return this.modelValue; },
      set(newValue) { this.$emit('update:modelValue', newValue); }
    },
    statusConfig() {
      const configs = {
        5: { title: 'Process Completed', color: 'success', titleIcon: 'mdi-check-circle', mainIcon: 'mdi-check-circle-outline', defaultMessage: 'The process has been completed successfully.' },
        6: { title: 'Process Error', color: 'error', titleIcon: 'mdi-close-circle', mainIcon: 'mdi-close-circle-outline', defaultMessage: 'An error occurred during the process execution.' },
        7: { title: 'Process Aborted', color: 'warning', titleIcon: 'mdi-alert-circle', mainIcon: 'mdi-alert-outline', defaultMessage: 'The process has been aborted by the user.' },
        default: { title: 'Process Status', color: 'primary', titleIcon: 'mdi-information', mainIcon: 'mdi-information-outline', defaultMessage: 'Process status updated.' }
      };
      return configs[this.idStatus] || configs.default;
    }
  },
  methods: {
    async fetchErrorMessage() {
      if (this.customMessage) { this.displayMessage = this.customMessage; return; }
      if (!this.executionId) return;
      
      const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null;
      if (!ipcRenderer) return;
      
      this.fetchingMessage = true;
      try {
        ipcRenderer.removeAllListeners('logHeadersResponse');
        ipcRenderer.removeAllListeners('logHeadersError');
        ipcRenderer.send('logHeaders', { guid: this.executionId });
        
        const logHeader = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
          ipcRenderer.once('logHeadersResponse', (_, response) => {
            clearTimeout(timeout);
            resolve(response?.results?.[0]?.[0] || null);
          });
          ipcRenderer.once('logHeadersError', (_, error) => {
            clearTimeout(timeout);
            reject(new Error(error));
          });
        });

        if (logHeader?.UIMessage) this.displayMessage = logHeader.UIMessage;
      } catch (error) {
        console.error('Failed to fetch error message:', error);
      } finally {
        this.fetchingMessage = false;
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.$emit('dialog-closed', this.idStatus);
      this.displayMessage = null;
    }
  },
  watch: {
    modelValue(newValue) { if (newValue && !this.displayMessage && !this.customMessage) this.fetchErrorMessage(); },
    executionId(newValue) { if (newValue && this.modelValue && !this.displayMessage && !this.customMessage) this.fetchErrorMessage(); },
    customMessage(newValue) { if (newValue) this.displayMessage = newValue; else if (this.modelValue && this.executionId) this.fetchErrorMessage(); }
  }
};
</script>
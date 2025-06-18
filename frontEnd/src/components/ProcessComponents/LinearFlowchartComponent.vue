<template>
  <v-card class="mb-4" variant="outlined">
    <v-card-title class="d-flex align-center pb-1 pt-3 px-4">
      <v-icon size="24" color="primary" class="mr-2">mdi-chart-timeline-variant</v-icon>
      <span class="text-h6">Process Flow</span>
    </v-card-title>
    <v-divider class="mx-4 mb-4"></v-divider>
    <v-card-text>
      <div class="flowchart-wrapper">
        <div class="linear-flowchart">
          <div v-for="(step, index) in processedSteps" :key="`icon-${index}`" class="flowchart-step-icon">
            <div class="step-circle" :class="{ 'step-active': step.isActive, 'step-completed': step.isCompleted }">
              <v-icon :color="getIconColor(step)" size="24" :class="{ 'icon-pulse': step.isActive }">
                {{ step.isCompleted && !step.isActive ? 'mdi-check' : step.icon }}
              </v-icon>
            </div>
            <div v-if="index < processedSteps.length - 1" class="step-connector" :class="{ 'connector-active': step.isActive || step.isCompleted, 'connector-completed': step.isCompleted }"></div>
          </div>
        </div>
        <div class="linear-flowchart-details">
          <div v-for="(step, index) in processedSteps" :key="`details-${index}`" class="flowchart-step-details">
            <div class="step-details" :class="{ 'active-step-details': step.isActive, 'completed-step-details': step.isCompleted }">
              <div class="step-name font-weight-bold">{{ step.name }}</div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null;

export default {
  name: 'LinearFlowchartComponent',
  props: {
    steps: { type: Array, required: true },
    executionId: { type: String, default: null }
  },
  data() {
    return {
      currentStatus: 0,
      internalSteps: [],
      progressInterval: null,
      isPolling: false,
      showPrsmLoadingStep: false
    };
  },
  computed: {
    processedSteps() {
      let steps = [];
      if (!this.internalSteps || this.internalSteps.length === 0) {
        return this.steps.map(step => ({ ...step, isActive: false, isCompleted: false }));
      } else {
        steps = this.internalSteps.map((step, index) => {
          const stepNumber = index + 1;
          return { ...step, isActive: stepNumber === this.currentStatus, isCompleted: stepNumber < this.currentStatus };
        });
      }
      if (!this.showPrsmLoadingStep) steps = steps.filter(step => step.name !== "Loading PRSM");
      return steps;
    }
  },
  methods: {
    updateStepsConfiguration() {
      if (this.showPrsmLoadingStep) {
        if (!this.internalSteps || this.internalSteps.length === 0) this.internalSteps = JSON.parse(JSON.stringify(this.steps));
        const prsmStepExists = this.internalSteps.some(step => step.name === "Loading PRSM");
        if (!prsmStepExists) {
          this.internalSteps.push({ name: "Loading PRSM", description: "Cargando datos en el sistema PRISM", icon: 'mdi-cloud-upload-outline', time: 0, step: this.internalSteps.length + 1 });
        }
      } else {
        if (this.internalSteps && this.internalSteps.length > 0) {
          const prsmIndex = this.internalSteps.findIndex(step => step.name === "Loading PRSM");
          if (prsmIndex !== -1) this.internalSteps.splice(prsmIndex, 1);
        }
      }
    },
    getIconColor(step) {
      if (step.isActive || step.isCompleted) return 'white';
      return 'grey';
    },
    startPolling() {
      if (this.isPolling) return;
      this.isPolling = true;
      this.updateProgressStatus();
      this.progressInterval = setInterval(() => this.updateProgressStatus(), 3000);
    },
    stopPolling() {
      if (!this.isPolling) return;
      if (this.progressInterval) { clearInterval(this.progressInterval); this.progressInterval = null; }
      this.isPolling = false;
    },
    updateProgressStatus() {
      if (!this.executionId || !ipcRenderer) return;
      ipcRenderer.send('logHeaders', { guid: this.executionId });
      ipcRenderer.once('logHeadersResponse', (_, data) => {
        if (data?.results?.[0]?.[0]) {
          const headerData = data.results[0][0];
          const isPrsmLoading = headerData.Status === "Loading PRSM";
          if (this.showPrsmLoadingStep !== isPrsmLoading) {
            this.showPrsmLoadingStep = isPrsmLoading;
            this.updateStepsConfiguration();
          }
          if (headerData.IdStatus !== undefined) {
            const newStatus = parseInt(headerData.IdStatus);
            if (newStatus !== this.currentStatus) {
              this.currentStatus = newStatus;
              if ([5, 6, 7].includes(newStatus)) {
                this.stopPolling();
                this.$emit('process-completed', newStatus);
              }
            }
          }
        }
      });
      ipcRenderer.once('logHeadersError', () => {});
    },
    cleanupResources() {
      this.stopPolling();
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('logHeadersResponse');
        ipcRenderer.removeAllListeners('logHeadersError');
      }
    }
  },
  watch: {
    executionId: {
      handler(newValue) {
        this.stopPolling();
        if (newValue && ipcRenderer) {
          this.currentStatus = 0;
          this.internalSteps = JSON.parse(JSON.stringify(this.steps));
          this.startPolling();
        }
      },
      immediate: true
    },
    steps: {
      handler(newSteps) { this.internalSteps = JSON.parse(JSON.stringify(newSteps)); },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    if (this.executionId && ipcRenderer) this.startPolling();
  },
  beforeUnmount() {
    this.cleanupResources();
  }
};
</script>

<style scoped>
.flowchart-wrapper { display: flex; flex-direction: column; }
.linear-flowchart { display: flex; align-items: center; justify-content: space-between; overflow-x: auto; padding: 10px 5px 25px; position: relative; }
.flowchart-step-icon { display: flex; align-items: center; position: relative; flex: 1; min-width: 80px; justify-content: center; }
.step-circle { width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; z-index: 2; transition: all 0.3s ease; border: 2px solid #e0e0e0; opacity: 0.7; }
.step-active { background-color: #1976d2; box-shadow: 0 5px 15px rgba(25, 118, 210, 0.5); border-color: #1976d2; opacity: 1; transform: scale(1.05); }
.step-completed { background-color: #4caf50; border-color: #4caf50; opacity: 1; }
.step-connector { position: absolute; height: 3px; background-color: #e0e0e0; width: calc(100% - 50px); left: calc(50% + 25px); top: 50%; transform: translateY(-50%); z-index: 1; transition: background-color 0.3s ease; }
.connector-active { background-color: #1976d2; }
.connector-completed { background-color: #4caf50; }
.linear-flowchart-details { display: flex; padding: 10px 5px; overflow-x: auto; }
.flowchart-step-details { flex: 1; min-width: 80px; display: flex; justify-content: center; text-align: center; padding: 0 5px; opacity: 0.7; transition: opacity 0.3s ease; }
.step-details { width: 100%; transition: all 0.3s ease; }
.active-step-details { opacity: 1; transform: translateY(-5px); font-weight: 500; }
.completed-step-details { opacity: 1; color: #4caf50; }
.step-name { font-size: 1rem; color: rgba(0, 0, 0, 0.87); font-weight: 500; transition: color 0.3s ease; }
.step-description { font-size: 0.875rem; color: rgba(0, 0, 0, 0.6); margin-top: 4px; transition: color 0.3s ease; }
@keyframes pulse-glow { 0% { filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 5px rgba(25, 118, 210, 0.6)); transform: scale(1); } 50% { filter: drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 18px rgba(25, 118, 210, 0.9)); transform: scale(1.15); } 100% { filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 5px rgba(25, 118, 210, 0.6)); transform: scale(1); } }
.icon-pulse { animation: pulse-glow 1.5s infinite ease-in-out; transform-origin: center; will-change: transform, filter; }
@media (max-width: 600px) { .linear-flowchart, .linear-flowchart-details { flex-direction: column; align-items: flex-start; } .flowchart-step-icon, .flowchart-step-details { width: 100%; margin-bottom: 10px; align-items: flex-start; justify-content: flex-start; padding-left: 20px; } .step-connector { position: absolute; width: 3px; height: 25px; left: 25px; top: 50px; right: auto; } .step-details { text-align: left; margin-left: 15px; } }
</style>
<template>
  <div class="interactive-flowchart">
    <v-card class="mb-2 mb-md-4 flowchart-card">
      <v-card-text class="pa-2 pa-md-4">
        <!-- Título responsive -->
        <div class="d-flex align-center mb-2 mb-md-3">
          <v-icon 
            :size="$vuetify.display.xs ? 24 : 32" 
            class="mr-2" 
            color="deep-purple-darken-1"
          >
            mdi-chart-timeline-variant
          </v-icon>
          <h2 :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'" class="mb-0">
            Process Steps
          </h2>
        </div>

        <!-- Información del proceso responsive -->
        <v-card class="mb-2 mb-md-4 process-info-card" variant="outlined" border>
          <v-card-title class="d-flex align-center pb-1 pt-2 pt-md-3 px-2 px-md-4">
            <v-icon 
              :size="$vuetify.display.xs ? 20 : 24" 
              color="primary" 
              class="mr-2"
            >
              mdi-information-outline
            </v-icon>
            <span :class="$vuetify.display.xs ? 'text-subtitle-1' : 'text-h6'">
              Process Information
            </span>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-divider class="mx-2 mx-md-4"></v-divider>

          <v-card-text class="pt-2 pt-md-4 px-2 px-md-4">
            <v-row>
              <!-- Información principal - Stack en móvil -->
              <v-col cols="12" md="6">
                <!-- Country -->
                <div class="d-flex align-center mb-2 mb-md-3">
                  <v-icon 
                    :size="$vuetify.display.xs ? 16 : 20" 
                    color="primary" 
                    class="mr-2 mr-md-3"
                  >
                    mdi-earth
                  </v-icon>
                  <div>
                    <div class="text-caption text-grey">Country</div>
                    <div :class="$vuetify.display.xs ? 'text-body-2' : ''" class="font-weight-medium">
                      {{ processData.Country || 'N/A' }}
                      <span class="text-caption text-grey d-none d-sm-inline">
                        ({{ processData.CountryCode || 'N/A' }})
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Scenario -->
                <div class="d-flex align-center mb-2 mb-md-3">
                  <v-icon 
                    :size="$vuetify.display.xs ? 16 : 20" 
                    color="orange-darken-2" 
                    class="mr-2 mr-md-3"
                  >
                    mdi-view-dashboard-outline
                  </v-icon>
                  <div>
                    <div class="text-caption text-grey">Scenario</div>
                    <div :class="$vuetify.display.xs ? 'text-body-2' : ''" class="font-weight-medium">
                      {{ processData.Scenario || 'N/A' }}
                      <span class="text-caption text-grey d-none d-sm-inline">
                        ({{ processData.IdScenario || 'N/A' }})
                      </span>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Información secundaria -->
              <v-col cols="12" md="6">
                <!-- Periods y End Period - Layout responsive -->
                <div class="d-flex align-center mb-2 mb-md-3" :class="$vuetify.display.xs ? 'flex-column align-start' : ''">
                  <div class="d-flex align-center" :class="$vuetify.display.xs ? 'mb-1' : ''">
                    <v-icon 
                      :size="$vuetify.display.xs ? 16 : 20" 
                      color="indigo" 
                      class="mr-2 mr-md-3"
                    >
                      mdi-calendar-range
                    </v-icon>
                    <div>
                      <div class="text-caption text-grey">Periods</div>
                      <div :class="$vuetify.display.xs ? 'text-body-2' : ''" class="font-weight-medium">
                        {{ processData.NumPeriod || 'N/A' }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="d-flex align-center" :class="$vuetify.display.xs ? '' : 'ml-4'">
                    <v-icon 
                      :size="$vuetify.display.xs ? 16 : 20" 
                      color="cyan-darken-1" 
                      class="mr-2 mr-md-3"
                    >
                      mdi-calendar-check
                    </v-icon>
                    <div>
                      <div class="text-caption text-grey">End Period</div>
                      <div :class="$vuetify.display.xs ? 'text-body-2' : ''" class="font-weight-medium">
                        {{ processData.EndPeriodYYYY || 'N/A' }}-{{ processData.EndPeriodMM || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Service -->
                <div class="d-flex align-center">
                  <v-icon 
                    :size="$vuetify.display.xs ? 16 : 20" 
                    color="green-darken-1" 
                    class="mr-2 mr-md-3"
                  >
                    mdi-apps
                  </v-icon>
                  <div>
                    <div class="text-caption text-grey">Service</div>
                    <div :class="$vuetify.display.xs ? 'text-body-2' : ''" class="font-weight-medium">
                      {{ processData.ServiceName || 'N/A' }}
                      <span class="text-caption text-grey d-none d-sm-inline">
                        ({{ processData.ServiceID || 'N/A' }})
                      </span>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Flowchart Component -->
        <LinearFlowchartComponent :steps="steps" :execution-id="executionId" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import LinearFlowchartComponent from './LinearFlowchartComponent.vue';

export default {
  name: 'HeaderProcessComponent',
  components: {
    LinearFlowchartComponent
  },
  props: {
    executionId: {
      type: String,
      required: true
    },
    processData: {
      type: Object,
      default: () => ({
        Country: '',
        CountryCode: '',
        ServiceName: '',
        ServiceID: '',
        Scenario: '',
        IdScenario: '',
        NumPeriod: 0,
        EndPeriodYYYY: 0,
        EndPeriodMM: 0,
        Environment: '',
        Owner: '',
        TicketJira: '',
        DateExecution: null,
        Status: ''
      })
    },
    steps: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
.process-info-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.process-info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.text-caption.text-grey {
  color: rgba(0, 0, 0, 0.6) !important;
  font-size: 0.75rem;
}

.font-weight-medium {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .text-body-2 {
    font-size: 0.875rem;
  }
}
</style>
<template>
  <div>
    <v-data-table 
      :headers="responsiveHeaders" 
      :items="filesData" 
      :items-per-page="-1" 
      :height="tableHeight"
      :loading="loading"
      loading-text="Loading files preview..."
      :density="$vuetify.display.xs ? 'compact' : 'default'"
      fixed-header 
      rounded
      class="elevation-2 mb-24 overflow-auto" 
      show-headers 
      hide-default-footer
      :header-props="{
        class: 'bg-grey-lighten-4 text-uppercase text-center font-weight-bold',
        style: 'border-bottom: 2px solid var(--v-orange-darken-2) !important;'
      }" 
      :item-class="item => item.Success === 1 ? 'downloaded-file' : ''"
    >
      <!-- Template para mostrar el nombre del archivo -->
      <template v-slot:item.file="{ item }">
        <div class="d-flex align-center">
          <v-icon 
            :size="$vuetify.display.xs ? 'x-small' : 'small'" 
            class="mr-1 mr-md-2"
          >
            mdi-file-document-outline
          </v-icon>
          <span :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ item.file || `${item.FileTitle}${item.Extension ? '.' + item.Extension : ''}` }}
          </span>
        </div>
      </template>

      <!-- Template para la columna Status -->
      <template v-slot:item.SwStatus="{ item }">
        <div class="d-flex justify-center">
          <v-icon 
            v-if="item.SwStatus === 1" 
            color="success" 
            :title="$vuetify.display.xs ? null : 'Completed'"
            :size="$vuetify.display.xs ? 'small' : 'medium'"
          >
            mdi-check-circle
          </v-icon>
          <v-icon 
            v-else 
            color="error" 
            :title="$vuetify.display.xs ? null : 'Pending'"
            :size="$vuetify.display.xs ? 'small' : 'medium'"
          >
            mdi-close-circle
          </v-icon>
        </div>
      </template>

      <!-- Template para la columna Internal Validation -->
      <template v-slot:item.SwInternalValidation="{ item }">
        <div class="d-flex justify-center">
          <v-icon 
            v-if="item.SwInternalValidation === 1" 
            color="success" 
            :title="$vuetify.display.xs ? null : 'Validated'"
            :size="$vuetify.display.xs ? 'small' : 'medium'"
          >
            mdi-check-circle
          </v-icon>
          <v-icon 
            v-else 
            color="error" 
            :title="$vuetify.display.xs ? null : 'Not validated'"
            :size="$vuetify.display.xs ? 'small' : 'medium'"
          >
            mdi-close-circle
          </v-icon>
        </div>
      </template>

      <!-- Template para Number Files en móvil -->
      <template v-slot:item.NumberFiles="{ item }">
        <div class="text-center">
          <span :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ item.NumberFiles || 0 }}
          </span>
        </div>
      </template>

      <!-- Template para la columna de progreso -->
      <template v-slot:item.AvancePorcentaje="{ item }">
        <div class="d-flex flex-column">
          <v-progress-linear 
            :model-value="parseInt(item.AvancePorcentaje)"
            :color="getProgressColorWithDownloadStatus(item)" 
            :height="$vuetify.display.xs ? 16 : 20"
            :striped="false"
            :indeterminate="false" 
            :stream="false" 
            :buffer-value="parseInt(item.AvancePorcentaje)"
          >
            <template v-slot:default>
              <div class="d-flex justify-space-between align-center px-1 px-md-2 w-100">
                <strong :class="$vuetify.display.xs ? 'text-caption' : ''">
                  {{ item.AvancePorcentaje }}%
                </strong>
                <span 
                  v-if="parseInt(item.AvancePorcentaje) === 100" 
                  class="text-caption white--text"
                  :class="$vuetify.display.xs ? 'd-none' : ''"
                >
                  <v-icon size="small" color="white" class="mr-1">mdi-check-circle</v-icon>
                  Downloaded
                </span>
                <span 
                  v-else 
                  class="text-caption grey--text text--darken-1"
                  :class="$vuetify.display.xs ? 'd-none' : ''"
                >
                  <v-icon size="small" color="grey darken-1" class="mr-1">mdi-clock-outline</v-icon>
                  Pending
                </span>
              </div>
            </template>
          </v-progress-linear>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'ProcessComponent',
  props: {
    executionId: {
      type: String,
      required: true
    },
    filesData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    responsiveHeaders() {
      const baseHeaders = [
        { title: "Files", key: "file", width: "35%" },
        { title: "Status", key: "SwStatus", width: "10%" },
        { title: "Progress", key: "AvancePorcentaje", width: "40%" },
        { title: "Validation", key: "SwInternalValidation", width: "15%" }
      ];

      // En pantallas medianas y grandes, agregar columna de Number Files
      if (this.$vuetify.display.smAndUp) {
        return [
          baseHeaders[0], // Files
          baseHeaders[1], // Status
          { title: "Number\nFiles", key: "NumberFiles", width: "10%" },
          { title: "Progress", key: "AvancePorcentaje", width: "35%" },
          baseHeaders[3]  // Validation
        ];
      }

      return baseHeaders;
    },

    tableHeight() {
      if (this.$vuetify.display.xs) return 300;
      if (this.$vuetify.display.sm) return 350;
      return 450;
    }
  },
  methods: {
    getProgressColorWithDownloadStatus(item) {
      // Si el archivo se ha descargado, usar un verde más vibrante
      if (item.Success === 1) {
        return 'success';
      }

      // Si no se ha descargado, usar el esquema de colores original
      const progress = parseInt(item.AvancePorcentaje || 0);
      if (progress < 50) return 'red';
      if (progress < 100) return 'orange';
      return 'green-lighten-1';
    }
  }
};
</script>

<style scoped>
.downloaded-file {
  background-color: rgba(76, 175, 80, 0.05) !important;
}

/* Ajustes responsivos para la tabla */
@media (max-width: 599px) {
  :deep(.v-data-table__wrapper) {
    font-size: 0.75rem;
  }
  
  :deep(.v-data-table th) {
    padding: 0 4px !important;
    font-size: 0.7rem !important;
  }
  
  :deep(.v-data-table td) {
    padding: 8px 4px !important;
  }
}

@media (min-width: 600px) {
  :deep(.v-data-table th) {
    padding: 16px 8px !important;
  }
  
  :deep(.v-data-table td) {
    padding: 12px 8px !important;
  }
}
</style>
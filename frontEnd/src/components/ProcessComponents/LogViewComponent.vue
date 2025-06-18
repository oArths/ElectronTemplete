<template>
  <!-- Cambiar a pa-0 para eliminar el padding del contenedor principal -->
  <v-container fluid class="pa-0 fill-height">
    <!-- Agregar width-100 a la primera tarjeta también -->
    <v-card class="mb-2 mx-0 mt-2 width-100">
      <v-card-title class="d-flex align-center pa-3 width-100">
        <v-icon color="orange-darken-2" class="mr-2" :size="$vuetify.display.xs ? 20 : 24">
          mdi-file-document-outline
        </v-icon>
        <span :class="$vuetify.display.xs ? 'text-h6' : 'text-h5'">Execution Logs</span>
        <v-spacer></v-spacer>
        <v-btn 
          icon 
          @click="closeDialog" 
          :title="$vuetify.display.xs ? null : 'Close'"
          :size="$vuetify.display.xs ? 'small' : 'default'"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-2 pa-md-3 width-100">
        <v-row class="ma-0 width-100">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search logs"
              variant="outlined"
              hide-details
              :density="$vuetify.display.xs ? 'compact' : 'default'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="actionFilter"
              :items="actionTypes"
              label="Filter by operation"
              variant="outlined"
              hide-details
              clearable
              :density="$vuetify.display.xs ? 'compact' : 'default'"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- La segunda tarjeta ya está correctamente configurada -->
    <v-card class="log-table-container flex-grow-1 d-flex flex-column mx-0">
      <v-data-table
        :headers="responsiveHeaders"
        :items="filteredLogs"
        :loading="loading"
        :search="search"
        class="log-table flex-grow-1 width-100"
        :items-per-page="-1" 
        hide-default-footer
        fixed-header
        :height="tableHeight"
        :density="$vuetify.display.xs ? 'compact' : 'default'"
      >        
        <!-- Template for Success/Error with icons -->
        <template v-slot:item.Success="{ item }">
          <div class="d-flex justify-center">
            <v-icon
              v-if="item.Success"
              color="success"
              :size="$vuetify.display.xs ? 16 : 20"
            >
              mdi-check-circle
            </v-icon>
            <v-icon
              v-else
              color="error"
              :size="$vuetify.display.xs ? 16 : 20"
            >
              mdi-close-circle
            </v-icon>
          </div>
        </template>
        
        <template v-slot:item.TimeStamp="{ item }">
          <span :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ formatTimestamp(item.TimeStamp) }}
          </span>
        </template>
        
        <template v-slot:item.Filename="{ item }">
          <span v-if="item.Filename" :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ item.Filename }}
          </span>
          <span v-else class="text-grey-lighten-1 text-caption">N/A</span>
        </template>

        <template v-slot:item.NumRow="{ item }">
          <span :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ item.NumRow }}
          </span>
        </template>

        <template v-slot:item.Action="{ item }">
          <span :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ item.Action }}
          </span>
        </template>

        <template v-slot:item.Description="{ item }">
          <span :class="$vuetify.display.xs ? 'text-caption' : ''" :title="item.Description">
            {{ truncateText(item.Description, $vuetify.display.xs ? 30 : 50) }}
          </span>
        </template>

        <template v-slot:item.UserExecution="{ item }">
          <span :class="$vuetify.display.xs ? 'text-caption' : ''">
            {{ item.UserExecution }}
          </span>
        </template>
        
        <template v-slot:no-data>
          <div class="text-center py-5">
            <v-icon size="48" color="grey-lighten-1">mdi-text-box-search-outline</v-icon>
            <div class="mt-3 text-body-1 text-grey-lighten-1">No logs available</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LogViewComponent',
  props: {
    executionId: {
      type: String,
      required: true
    },
    logs: {
      type: Array,
      default: () => []
    },
    executionInfo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      actionFilter: null,
      headers: [
        { title: 'Row #', key: 'NumRow', width: '8%', sortable: true, align: 'center' },
        { title: 'File', key: 'Filename', width: '20%', sortable: true },
        { title: 'Result', key: 'Success', width: '10%', sortable: true, align: 'center' },
        { title: 'Operation', key: 'Action', width: '15%', sortable: true },
        { title: 'Details', key: 'Description', width: '15%', sortable: true },
        { title: 'Date & Time', key: 'TimeStamp', width: '15%', sortable: true },
        { title: 'Executed By', key: 'UserExecution', width: '17%', sortable: true }
      ],
      actionTypes: [],
    };
  },
computed: {
    filteredLogs() {
      if (!this.logs) return [];
      
      // If no action filter, return all logs
      if (!this.actionFilter) return this.logs;
      
      // Filter by action type
      return this.logs.filter(log => log.Action === this.actionFilter);
    },
    responsiveHeaders() {
      // On very small screens, show only essential columns
      if (this.$vuetify.display.xs) {
        return [
          { title: '#', key: 'NumRow', width: '10%' },
          { title: 'File', key: 'Filename', width: '30%' },
          { title: 'Result', key: 'Success', width: '15%', align: 'center' },
          { title: 'Operation', key: 'Action', width: '25%' },
          { title: 'Time', key: 'TimeStamp', width: '20%' }
        ];
      }
      
      // On small screens, hide some columns
      if (this.$vuetify.display.sm) {
        return [
          { title: 'Row #', key: 'NumRow', width: '8%' },
          { title: 'File', key: 'Filename', width: '22%' },
          { title: 'Result', key: 'Success', width: '12%', align: 'center' },
          { title: 'Operation', key: 'Action', width: '18%' },
          { title: 'Details', key: 'Description', width: '25%' },
          { title: 'Date & Time', key: 'TimeStamp', width: '15%' }
        ];
      }
      
      // Medium and large screens: all columns
      return this.headers;
    },
    tableHeight() {
      // Modified to use a calculation based on available space
      return 'calc(100vh - 220px)'; // Dynamic height to fill available space
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return '-';
      // If mobile, show only time
      if (this.$vuetify.display.xs) {
        const parts = timestamp.split(' ');
        return parts[1] || timestamp; // Only time part
      }
      return timestamp; // Complete timestamp
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    extractActionTypes() {
      if (!this.logs || this.logs.length === 0) return;
      
      const actionSet = new Set();
      this.logs.forEach(log => {
        if (log.Action) actionSet.add(log.Action);
      });
      
      this.actionTypes = Array.from(actionSet);
    }
  },
  mounted() {
    this.extractActionTypes();
  },
  watch: {
    logs: {
      handler(newLogs) {
        console.log('Logs prop changed:', newLogs?.length || 0, 'entries');
        if (newLogs && newLogs.length > 0) {
          this.extractActionTypes();
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
/* Modificar el contenedor de la tabla para eliminar márgenes horizontales */
.log-table-container {
  margin: 0 !important; /* Eliminar todos los márgenes */
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 100%; /* Garantizar que ocupe el ancho completo */
}

.log-table {
  margin-top: 0;
  flex-grow: 1;
  width: 100%; /* Asegurar que la tabla ocupa todo el ancho disponible */
}

/* Clase mejorada para garantizar ancho completo en todos los elementos */
.width-100 {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Asegurar que el contenedor principal ocupa todo el ancho */
.fill-height {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100% !important; /* Usar 100% en lugar de 100vw para evitar scroll horizontal */
  max-width: 100% !important; /* Asegurar que no causa scroll horizontal */
  padding: 0 !important; /* Eliminar padding en todas direcciones */
  margin: 0 !important; /* Eliminar margen en todas direcciones */
}

/* Eliminar cualquier padding interno del contenedor v-container */
:deep(.v-container) {
  padding: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
}

/* Asegurar que las tarjetas no tienen márgenes internos no deseados */
:deep(.v-card) {
  width: 100% !important;
}

:deep(.v-card__title),
:deep(.v-card__text) {
  width: 100% !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
}

/* Resto de estilos permanecen igual... */
</style>
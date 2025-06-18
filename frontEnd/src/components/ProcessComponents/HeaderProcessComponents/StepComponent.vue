<template>
    <v-list-item>
        <v-list-item-title>
            <v-row>
                <v-col class="font-weight-bold">
                    {{ filteredStepName }}
                </v-col>
                <v-col :class="active ? 'text-animate' : ''" class="text-h6 font-weight-bold">
                    <v-icon color="blue" size="24">{{ stepIcon }}</v-icon>
                    {{ filteredStepDescription }}
                </v-col>
            </v-row>
        </v-list-item-title>
        <v-list-item-content>
            <v-list-item-subtitle>Processing Time: {{ stepTime }}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    name: 'HeaderProcessComponent',
    props: {
        stepName: {
            type: String,
        },
        stepDescription: {
            type: String,
        },
        stepIcon: {
            type: String,
        },
        stepTime: {
            type: String,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        // Solo filtrar el nombre y descripción del paso
        filteredStepName() {
            if (!this.stepName) return '';
            return this.stepName;
        },
        filteredStepDescription() {
            if (!this.stepDescription) return '';
            return this.stepDescription;
        }
    }
}
</script>

<style scoped>
@keyframes move-up-right {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(5px, -5px); /* Moves 5px right and 5px up */
  }
  100% {
    transform: translate(0, 0);
  }
}

.text-animate {
  display: inline-block; /* Ensure the animation applies to inline elements */
  animation: move-up-right 1.5s infinite ease-in-out; /* Infinite animation */
}
</style>
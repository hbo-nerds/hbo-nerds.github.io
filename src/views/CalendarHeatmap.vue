<template>
  <div>
    <span class="d-inline-flex gap-2 mb-3">
      <span class="badge rounded-pill text-bg-warning">Let op!</span>
      <span class="fw-lighter small">De heatmap maakt gebruik van de huidige filters.</span>
    </span>
    <div v-for="(value, key, index) in heatmapData" class="overflow-y-auto mb-3">
      <span>{{ key }}</span>
      <CalendarHeatmap
        :key="`${key}_${index}`"
        :end-date="key + '-12-31'"
        :show-legend="false"
        :values="value.dates"
        class="heatmap"
        dark-mode
        @day-click="goToCard"
      />
    </div>
    <button
      ref="canvasBtn"
      class="d-none"
      data-bs-target="#singleCardModel"
      data-bs-toggle="modal"
      type="button"
    ></button>
  </div>
</template>

<script setup>
import CalendarHeatmap from "@/components/Heatmap/CalendarHeatmap.vue";
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const contentStore = useContentStore();
const { selectedCardId } = storeToRefs(contentStore);

const canvasBtn = ref(null);

/**
 * Navigate to item
 */
function goToCard(day) {
  let id = day.id;
  selectedCardId.value = selectedCardId.value === id ? null : id;
  if (selectedCardId.value && canvasBtn.value) canvasBtn.value.click();
}

const heatmapData = computed(() => {
  return contentStore.groupedYearDate;
});
</script>

<style lang="sass">
@media (max-width: 576px)
  .heatmap
    min-width: 1000px
</style>

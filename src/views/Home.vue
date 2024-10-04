<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="sticky-top z-3 bg-body row align-items-center g-3 pb-3">
      <div class="col-auto">
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-dark border-0"
            @click="view = 'thumbnail'"
            title="Thumbnail view"
            :class="{ active: view === 'thumbnail' }"
          >
            <i class="bi bi-images"></i>
          </button>
          <button
            type="button"
            class="btn btn-dark border-0"
            @click="view = 'heatmap'"
            title="Heatmap view"
            :class="{ active: view === 'heatmap' }"
          >
            <i class="bi bi-calendar3"></i>
          </button>
          <button
            type="button"
            class="btn btn-dark border-0"
            @click="view = 'random'"
            title="Random view"
            :class="{ active: view === 'random' }"
          >
            <i class="bi bi-dice-5"></i>
          </button>
        </div>
      </div>
      <FilterHorizontal />
      <div class="col-auto">
        <span class="small"
          >{{ sortedData.length }} {{ sortedData.length === 1 ? "resultaat" : "resultaten" }}</span
        >
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-sm">
        <keep-alive>
          <List v-if="view === 'thumbnail'" />
          <CalendarHeatmap v-else-if="view === 'heatmap'" />
          <Random v-else-if="view === 'random'" />
        </keep-alive>
      </div>
    </div>
  </main>
</template>

<script setup>
import FilterHorizontal from "@/components/FilterHorizontal.vue";
import { useContentStore } from "@/stores/content.js";
import CalendarHeatmap from "@/views/CalendarHeatmap.vue";
import List from "@/views/List.vue";
import Random from "@/views/Random.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const contentStore = useContentStore();
const { sortedData } = storeToRefs(contentStore);
const view = ref("thumbnail");
</script>

<style scoped></style>

<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="sticky-top bg-body row g-2 pb-3">
      <div class="col-auto">
        <div class="btn-group" role="group" aria-label="Basic outlined example">
          <button
            type="button"
            class="btn btn-dark"
            @click="view = 'thumbnail'"
            :class="{ active: view === 'thumbnail' }"
          >
            <i class="bi bi-images"></i>
          </button>
          <button
            type="button"
            class="btn btn-dark"
            @click="view = 'heatmap'"
            :class="{ active: view === 'heatmap' }"
          >
            <i class="bi bi-calendar3"></i>
          </button>
        </div>
      </div>
      <FilterHorizontal />
    </div>
    <div class="row">
      <div class="col-12 col-sm">
        <keep-alive>
          <List v-if="view === 'thumbnail'" />
          <CalendarHeatmap v-else-if="view === 'heatmap'" />
        </keep-alive>
      </div>
    </div>
  </main>
</template>

<script setup>
import FilterHorizontal from "@/components/FilterHorizontal.vue";
import List from "@/components/List.vue";
import CalendarHeatmap from "@/views/CalendarHeatmap.vue";
import { ref } from "vue";

const view = ref("thumbnail");
</script>

<style scoped></style>

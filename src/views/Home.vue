<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12 col-sm">
        <div class="d-flex gap-2 mb-3">
          <button
            :class="{ active: view === 'thumbnail' }"
            class="btn btn-dark rounded"
            @click="view = 'thumbnail'"
          >
            <i class="bi bi-images"></i>
          </button>
          <button
            :class="{ active: view === 'heatmap' }"
            class="btn btn-dark rounded"
            @click="view = 'heatmap'"
          >
            <i class="bi bi-calendar3"></i>
          </button>
        </div>
        <keep-alive>
          <List v-if="view === 'thumbnail'" />
          <CalendarHeatmap v-else-if="view === 'heatmap'" />
        </keep-alive>
      </div>
    </div>
  </main>
</template>

<script setup>
import List from "@/components/List.vue";
import CalendarHeatmap from "@/views/CalendarHeatmap.vue";
import { ref } from "vue";

const view = ref("thumbnail");
</script>

<style scoped></style>

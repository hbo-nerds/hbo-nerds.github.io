<template>
  <!-- main -->
  <main class="pt-3 pb-5">
    <div class="row">
      <div class="col-12">
        <h1 class="fw-bold mb-4">Series</h1>
        <series />
      </div>
    </div>
  </main>
</template>

<script setup>
import Series from "@/containers/Series.vue";
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
const contentStore = useContentStore();
const { sortOptionSeries } = storeToRefs(contentStore);
</script>

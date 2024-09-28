<template>
  <div ref="scrollComponent" class="scrolling-component pb-5">
    <div
      v-if="view === 'main'"
      class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
    >
      <div v-for="(card, index) in cards" :key="index" class="col">
        <Card :card="card" />
      </div>
    </div>
    <div v-else-if="view === 'random'">
      <div class="d-flex flex-wrap gap-3 align-items-center mb-3">
        <button
          class="btn btn-dark rounded-pill d-inline-block"
          type="button"
          @click="contentStore.pickRandomSet()"
        >
          <i class="bi bi-dice-5 me-2"></i>Geef mij wat anders
        </button>
        <span class="d-inline-flex gap-2">
          <span class="badge rounded-pill text-bg-warning">Let op!</span>
          <span class="fw-lighter small">De randomizer maakt gebruik van de huidige filters.</span>
        </span>
      </div>
      <div
        class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
      >
        <div v-for="(card, index) in randomData" :key="index" class="col">
          <Card :card="card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, ref, watch } from "vue";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { sortedData, randomData } = storeToRefs(contentStore);
const { view } = storeToRefs(generalStore);

const cards = ref([]);
const start = ref(0);
const scrollComponent = ref(null);

useInfiniteScroll(
  document.getElementById("main-content"),
  () => {
    loadMoreCards();
  },
  { distance: 10 },
);

const loadMoreCards = () => {
  let newCards = sortedData.value.slice(start.value, start.value + 20);
  start.value += 20;
  cards.value.push(...newCards);
};

function initialize() {
  start.value = 0;
  cards.value = sortedData.value.slice(start.value, 20);
  start.value += 20;
}

/**
 * Start from 0 if base data changes due to filter.
 */
watch(
  () => sortedData.value,
  () => {
    console.log("change!");
    initialize();
  },
  { deep: true },
);
</script>

<style scoped></style>

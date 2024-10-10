<template>
  <div ref="scrollComponent" class="scrolling-component">
    <div
      class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
      :class="
        selectedCard
          ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
          : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
      "
    >
      <div v-for="(card, index) in cards" :key="index" class="col">
        <Card :card="card" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { useLayoutStore } from "@/stores/layout.js";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onActivated, onDeactivated, ref, watch } from "vue";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { sortedData, selectedCard } = storeToRefs(contentStore);

const active = ref(false);
const cards = ref([]);
const start = ref(0);
const scrollComponent = ref(null);

useInfiniteScroll(
  document.getElementById("main-content"),
  () => {
    if (active.value) loadMoreCards();
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

onDeactivated(() => {
  active.value = false;
});

onActivated(() => {
  active.value = true;
  const el = document.getElementById("main-content");
  if (el) el.scrollTo({ top: layoutStore.homeScroll, behavior: "instant" });
});

/**
 * Start from 0 if base data changes due to filter.
 */
watch(
  () => sortedData.value,
  () => {
    initialize();
  },
  { deep: true },
);
</script>

<style scoped></style>

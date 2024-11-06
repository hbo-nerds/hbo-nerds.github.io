<template>
  <div class="scrolling-component">
    <div
      class="row g-4"
      :class="
        selectedCard
          ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
          : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
      "
    >
      <div v-for="(card, index) in cards" :key="card.id" class="col">
        <Card :card="card" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContentStore } from "@/stores/content.js";
import { useLayoutStore } from "@/stores/layout.js";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onActivated, onDeactivated, ref, watch } from "vue";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { sortedData, selectedCard } = storeToRefs(contentStore);

const active = ref<boolean>(false);
const cards = ref<any[]>([]);
const start = ref<number>(0);
const amountToAdd = 20;

useInfiniteScroll(
  document.getElementById("main-content"),
  () => {
    if (active.value) loadMoreCards();
  },
  { distance: 40 },
);

/**
 * Add new cards to infinite scroll.
 */
const loadMoreCards = () => {
  let newCards = sortedData.value.slice(start.value, start.value + amountToAdd);
  start.value += amountToAdd;
  cards.value.push(...newCards);
};

/**
 * Set first set of cards.
 */
function initialize() {
  start.value = 0;
  cards.value = sortedData.value.slice(start.value, amountToAdd);
  start.value += amountToAdd;
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

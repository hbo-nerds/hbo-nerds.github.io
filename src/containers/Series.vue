<template>
  <select v-model="sort" class="form-select mb-4 w-auto">
    <option value="alphaAsc">A-Z</option>
    <option value="alphaDesc">Z-A</option>
    <option value="createdAsc">Aanmaakdatum (oudste eerst)</option>
    <option value="createdDesc">Aanmaakdatum (nieuwste eerst)</option>
    <option value="updatedAsc">Updatedatum (oudste eerst)</option>
    <option value="updatedDesc">Updatedatum (nieuwste eerst)</option>
  </select>

  <div ref="scrollComponent" class="scrolling-component pb-5">
    <div
      class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
    >
      <div v-for="(card, idx) in cards" :key="idx" class="col">
        <Card :card="card" :is-series="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import {computed, defineAsyncComponent, ref, watch} from "vue";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const { getCompleteCollections } = storeToRefs(contentStore);

const cards = ref([]);
const start = ref(0);
const scrollComponent = ref(null);

const sort = ref("alphaAsc");

/**
 * Return sorted list of playlists.
 * @type {ComputedRef<*>}
 */
const sortedPlaylists = computed(() => {
  return getCompleteCollections.value.filter((col) => col.items.length).sort((a, b) => {
    if (sort.value === "alphaAsc") {
      return a.title.localeCompare(b.title);
    } else if (sort.value === "alphaDesc") {
      return b.title.localeCompare(a.title);
    } else if (sort.value === "createdAsc") {
      return a.created - b.created;
    } else if (sort.value === "createdDesc") {
      return b.created - a.created;
    } else if (sort.value === "updatedAsc") {
      return a.updated - b.updated;
    } else if (sort.value === "updatedDesc") {
      return b.updated - a.updated;
    } else return true
  });
});

useInfiniteScroll(
  document.getElementById("main-content"),
  () => {
    loadMoreCards();
  },
  { distance: 10 },
);

const loadMoreCards = () => {
  let newCards = sortedPlaylists.value.slice(start.value, start.value + 20).map((col) => col.items[0]);
  start.value += 20;
  cards.value.push(...newCards);
};

function initialize() {
  start.value = 0;
  cards.value = sortedPlaylists.value.slice(start.value, 20).map((col) => col.items[0]);
  start.value += 20;
}

/**
 * Start from 0 if base data changes due to filter.
 */
watch(
  () => sortedPlaylists.value,
  () => {
    initialize();
  },
  { deep: true },
);
</script>

<style scoped></style>

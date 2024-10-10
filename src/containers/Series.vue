<template>
  <SortSelect
    class="mb-4"
    :sort-options="sortOptions"
    :active="sort"
    @select="
      (val) => {
        sort = val;
      }
    "
  />
  <div ref="scrollComponent" class="scrolling-component pb-5">
    <div
      class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4"
    >
      <div v-for="(serie, idx) in series" :key="idx" class="col">
        <Card :card="serie.card" :serie="serie" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SortSelect from "@/components/SortSelect.vue";
import { useContentStore } from "@/stores/content.js";
import { useLayoutStore } from "@/stores/layout.js";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, onActivated, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { getCompleteCollections } = storeToRefs(contentStore);

const series = ref([]);
const start = ref(0);
const scrollComponent = ref(null);

const sort = ref("alphaAsc");
const sortOptions = [
  { value: "alphaAsc", label: "A-Z" },
  { value: "alphaDesc", label: "Z-A" },
  { value: "createdAsc", label: "Aanmaakdatum (oudste eerst)" },
  { value: "createdDesc", label: "Aanmaakdatum (nieuwste eerst)" },
  { value: "updatedAsc", label: "Updatedatum (oudste eerst)" },
  { value: "updatedDesc", label: "Updatedatum (nieuwste eerst)" },
];

onActivated(() => {
  const el = document.getElementById("main-content");
  if (el) el.scrollTo({ top: layoutStore.seriesScroll, behavior: "instant" });
});

onBeforeRouteLeave(() => {
  layoutStore.seriesScroll = document.getElementById("main-content").scrollTop;
});

/**
 * Return sorted list of playlists.
 * @type {ComputedRef<*>}
 */
const sortedPlaylists = computed(() => {
  return getCompleteCollections.value
    .filter((col) => col.items.length)
    .sort((a, b) => {
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
      } else return true;
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
  let newCards = sortedPlaylists.value.slice(start.value, start.value + 20).map((col) => {
    return { title: col.title, card: col.items[0], id: col.id, count: col.items.length };
  });
  start.value += 20;
  series.value.push(...newCards);
};

function initialize() {
  start.value = 0;
  series.value = sortedPlaylists.value.slice(start.value, 20).map((col) => {
    return { title: col.title, card: col.items[0], id: col.id };
  });
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

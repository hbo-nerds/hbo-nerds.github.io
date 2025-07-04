<template>
    <SortSelect
        :active="sort"
        :sort-options="sortOptions"
        class="mb-4"
        @select="
            (val) => {
                sort = val;
            }
        "
    />
    <div ref="scrollComponent" class="scrolling-component pb-5">
        <div
            :class="
                selectedCard
                    ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
                    : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
            "
            class="row g-4"
        >
            <div v-for="(serie, idx) in series" :key="idx" class="col">
                <Card v-if="serie.card" :card="serie.card" :serie="serie" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SortSelect from "@/components/SortSelect.vue";
import { useContentStore } from "@/stores/content.ts";
import { useLayoutStore } from "@/stores/layout.ts";
import type { Collection } from "@/types/Series.ts";
import { useInfiniteScroll } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, defineAsyncComponent, onActivated, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { getCompleteCollections, selectedCard } = storeToRefs(contentStore);

const series = ref<Collection[]>([]);
const start = ref<number>(0);
const scrollComponent = ref<HTMLElement | null>(null);

const sort = ref<string>("alphaAsc");
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
    const el = document.getElementById("main-content");
    if (el) layoutStore.seriesScroll = el.scrollTop;
});

/**
 * Return a sorted list of playlists.
 * @type {ComputedRef<*>}
 */
const sortedPlaylists: ComputedRef<Collection[]> = computed(() => {
    return getCompleteCollections.value
        .filter((col) => col.items?.length)
        .sort((a, b) => {
            switch (sort.value) {
                case "alphaAsc":
                    return a.title.localeCompare(b.title);
                case "alphaDesc":
                    return b.title.localeCompare(a.title);
                case "createdAsc":
                    return (a.created?.getTime() ?? 0) - (b.created?.getTime() ?? 0);
                case "createdDesc":
                    return (b.created?.getTime() ?? 0) - (a.created?.getTime() ?? 0);
                case "updatedAsc":
                    return (a.updated?.getTime() ?? 0) - (b.updated?.getTime() ?? 0);
                case "updatedDesc":
                    return (b.updated?.getTime() ?? 0) - (a.updated?.getTime() ?? 0);
                default:
                    return 0;
            }
        });
});

useInfiniteScroll(
    document.getElementById("main-content"),
    () => {
        loadMoreCards();
    },
    { distance: 10 },
);

/**
 * Function to load more cards from a sorted list of playlists.
 * Extracts a subset of playlists, processes them to add additional properties,
 * and appends the processed cards to an existing series.
 * The start index is incremented by 20 after each execution.
 */
const loadMoreCards = () => {
    const newCards = sortedPlaylists.value
        .slice(start.value, start.value + 20)
        .map((col: Collection) => ({
            ...col,
            card: col.items?.[0],
            count: col.items?.length,
        }));

    start.value += 20;
    series.value.push(...newCards);
};

/**
 * Initializes the series array with a subset of playlists data starting from a specific index.
 *
 * The method extracts a batch of 20 items from the sortedPlaylists array, starting from the index determined by the
 * start value. Each item in the batch is mapped and augmented with an additional card property based on its items field.
 * The start value is incremented by 20 after processing to prepare for the next batch.
 *
 * @return {void} Does not return a value. The operation updates shared states (`start.value` and `series.value`) directly.
 */
function initialize() {
    start.value = 0;
    series.value = sortedPlaylists.value.slice(start.value, 20).map((col) => ({
        ...col,
        card: col.items?.[0],
    }));
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

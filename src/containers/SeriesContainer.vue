<template>
    <div ref="scrollComponent" class="scrolling-component pb-5">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-4">
            <div v-for="(card, idx) in cards" :key="idx" class="col">
                <card-component :card="card" :is-series="true"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, defineAsyncComponent, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useInfiniteScroll} from "@vueuse/core";
import {useContentStore} from "@/stores/content.js";

const CardComponent = defineAsyncComponent(() =>
    import("@/components/cardComponent.vue")
)

const contentStore = useContentStore()
const {sortedDataSeries} = storeToRefs(contentStore)

const cards = ref([])
const start = ref(0)
const scrollComponent = ref(null)

useInfiniteScroll(
    document.getElementById("main-content"),
    () => {
        loadMoreCards()
    },
    {distance: 10}
)

const loadMoreCards = () => {
    let newCards = sortedDataSeries.value.slice(start.value, start.value + 20);
    start.value += 20;
    cards.value.push(...newCards);
}

function initialize() {
    start.value = 0;
    cards.value = sortedDataSeries.value.slice(start.value, 20);
    start.value += 20;
}

/**
 * Start from 0 if base data changes due to filter.
 */
watch(() => sortedDataSeries.value, () => {
    initialize()
}, {deep: true})

</script>

<style scoped></style>

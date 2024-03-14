<template>
    <div class="row g-2 mb-3">
        <div class="col-12">{{ seriesFirstItems.length}} resultaten</div>
        <div class="col-12" v-if="!seriesFirstItems.length">Lekker Appie! Geen resultaten gevonden.</div>
        <div class="col-6 col-md-4 col-lg-3" v-for="(card, idx) in seriesFirstItems" :key="idx">
            <card-component :card="card"/>
        </div>
    </div>
</template>

<script setup>
import {defineAsyncComponent} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";

const CardComponent = defineAsyncComponent(() =>
    import("@/components/cardComponent.vue")
)

// store
const generalStore = useGeneralStore()
const contentStore = useContentStore()
const {pageSize, pageNumber} = storeToRefs(generalStore)
const {sortedData, search, seriesFirstItems} = storeToRefs(contentStore)

</script>

<style scoped></style>

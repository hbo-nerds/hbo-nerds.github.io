<template>
    <div class="row g-2">
        <template v-if="view === 'random'">
            <div class="col-12">Dit zijn 12 <b>random</b> items speciaal voor jou!
                <button type="button" class="btn btn-sm btn-link" @click="contentStore.pickRandomSet()">Geef me wat anders.</button>
            </div>
            <div class="col-6 col-md-4 col-lg-3" v-for="(card, idx) in randomData" :key="idx">
                <card-component :card="card"/>
            </div>
        </template>
        <template v-if="view === 'thumbnails'">
            <div class="col-12">{{ sortedData.length}} resultaten</div>
            <div class="col-12" v-if="!sortedData.length">Lekker Appie! Geen resultaten gevonden.</div>
            <div class="col-6 col-md-4 col-lg-3" v-for="(card, idx) in sortedData" :key="idx">
                <card-component :card="card"/>
            </div>
        </template>
        <template v-if="view === 'list'">
            <div class="col-12">{{ sortedData.length}} resultaten</div>
            <div class="col-12" v-if="!sortedData.length && !search.length < 3">Lekker Appie! Geen resultaten gevonden.</div>
            <div class="col-12" v-for="(card, idx) in sortedData" :key="idx">
                <card-component-list :card="card"/>
            </div>
        </template>
    </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";
const CardComponent = defineAsyncComponent(() =>
    import("@/components/cardComponent.vue")
)
const CardComponentList = defineAsyncComponent(() =>
    import("@/components/cardComponentList.vue")
)

// store
const generalStore = useGeneralStore()
const contentStore = useContentStore()
const {view} = storeToRefs(generalStore)
const {sortedData, randomData, search} = storeToRefs(contentStore)

if (!randomData.value.length)
    contentStore.pickRandomSet()
</script>

<style scoped></style>

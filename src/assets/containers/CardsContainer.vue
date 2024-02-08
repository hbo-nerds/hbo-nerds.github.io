<template>
    <div class="row g-2">
        <div :class="selectedCard ? 'col-6' : 'col-6 col-md-4 col-lg-3'" v-if="search.length >= 3" v-for="(card, idx) in sortedData" :key="idx">
            <card-component :card="card"/>
        </div>
        <div :class="selectedCard ? 'col-6' : 'col-6 col-md-4 col-lg-3'" v-if="search.length < 3" v-for="(card, idx) in randomData" :key="idx">
            <card-component :card="card"/>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import CardComponent from "@/components/cardComponent.vue";
import {useGeneralStore} from "@/stores/general.js";

// store
const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {sortedData, randomData, search} = storeToRefs(contentStore)
const {selectedCard} = storeToRefs(generalStore)

if (!randomData.value.length)
    contentStore.pickRandomSet()
</script>

<style scoped></style>

<template>
    <div class="row g-2">
        <div class="col-6 col-md-4 col-lg-3" v-if="search.length >= 3" v-for="(card, idx) in sortedData" :key="idx">
            <card-component :card="card"/>
        </div>
        <div class="col-6 col-md-4 col-lg-3" v-if="search.length < 3" v-for="(card, idx) in randomData" :key="idx">
            <card-component :card="card"/>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import CardComponent from "@/components/cardComponent.vue";

// store
const contentStore = useContentStore()
const {sortedData, randomData, search} = storeToRefs(contentStore)

if (!randomData.value.length)
    contentStore.pickRandomSet()
</script>

<style scoped></style>

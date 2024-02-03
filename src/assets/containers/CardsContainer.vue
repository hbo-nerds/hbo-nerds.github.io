<template>
    <div class="col-4" v-for="(card, idx) in filteredData" :key="idx">
        <card-component :card="card" :images="images"/>
    </div>
    <div class="col-4" v-if="!filteredData.length" v-for="(card, idx) in randomData" :key="idx">
        <card-component :card="card" :images="images"/>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import CardComponent from "@/components/cardComponent.vue";
import {filename} from "pathe/utils";

// images
const glob = import.meta.glob('@/assets/img/thumbnails/*/*.webp', {eager: true})
const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)

// store
const content = useContentStore()
const {filteredData, randomData} = storeToRefs(content)
content.pickRandomSet()
</script>

<style scoped>

</style>
<template>
    <div class="col-12" v-if="!sortedData.length && search">Lekker Appie! Geen resultaten gevonden.</div>
    <div class="col-12" v-if="!search">Dit zijn 12 <b>random</b> items speciaal voor jou! <button type="button" class="btn btn-sm btn-link" @click="content.pickRandomSet()">Geef me wat anders.</button> </div>
    <div class="col-6 col-md-4 col-lg-3" v-if="search.length >= 3" v-for="(card, idx) in sortedData" :key="idx">
        <card-component :card="card" :images="images"/>
    </div>
    <div class="col-6 col-md-4 col-lg-3" v-if="search.length < 3" v-for="(card, idx) in randomData" :key="idx">
        <card-component :card="card" :images="images"/>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import CardComponent from "@/components/cardComponent.vue";
import {filename} from "pathe/utils";

// images
const glob = import.meta.glob('@/assets/img/thumbnails/*320px/*.webp', {eager: true})
const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)

// store
const content = useContentStore()
const {filteredData, sortedData, randomData, search} = storeToRefs(content)
content.pickRandomSet()
</script>

<style scoped>

</style>
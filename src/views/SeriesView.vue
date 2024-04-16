<template>
    <!-- main -->
    <main style="padding-top: 42px" class="position-relative">
        <div class="row mb-3">
            <div class="col">
                <h3>Series</h3>
                <p>Perfect voor een luie zondagmiddag binge!
                    Ontdek onze verzameling Video on Demand (VOD) afleveringen, van epische multiplayer avonturen tot
                    hilarische singleplayer escapades. Klik op een serie en laat je meevoeren door een wereld vol
                    plezier, verrassingen en onvergetelijke momenten. Het beste excuus voor een ontspannen bingesessie
                    op een luie zondagmiddag!</p>
            </div>
        </div>
        <div class="row align-items-center mb-3">
            <div class="col-auto ms-auto d-none d-md-block">
                <span>Sorteer op</span>
            </div>
            <div class="col-auto ms-auto ms-md-0">
                <select class="form-select form-select-sm" v-model="sortOptionSeries">
                    <option value="newOld">Datum (nieuw-oud)</option>
                    <option value="oldNew">Datum (oud-nieuw)</option>
                </select>
            </div>
        </div>
        <series-container></series-container>
    </main>
</template>

<script setup>
import SeriesContainer from "@/containers/SeriesContainer.vue";
import {storeToRefs} from "pinia";
import {useContentStore} from "@/stores/content.js";
const contentStore = useContentStore()
const {sortOptionSeries} = storeToRefs(contentStore)
</script>

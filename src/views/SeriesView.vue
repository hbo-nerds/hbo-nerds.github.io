<template>
    <!-- main -->
    <main>
        <div class="row mb-3">
            <div class="col">
                <h3>Series</h3>
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

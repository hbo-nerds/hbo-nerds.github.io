<template>
    <!-- main -->
    <main class="pt-3 pb-5">
        <div class="row">
            <div class="col-12">
                <h1 class="fw-bold mb-4">Series</h1>
                <series-container/>
            </div>
        </div>
    </main>
</template>

<script setup>
import SeriesContainer from "@/containers/SeriesContainer.vue";
import {storeToRefs} from "pinia";
import {useContentStore} from "@/stores/content.js";
const contentStore = useContentStore()
const {sortOptionSeries} = storeToRefs(contentStore)
</script>

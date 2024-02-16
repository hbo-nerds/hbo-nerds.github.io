<template>
    <h6 class="fw-bold mb-2">Verfijn resultaten</h6>
    <div class="mb-3">
        <!-- type -->
        <div class="mb-3">
            <label class="form-label small">Type</label>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="checkPodcast" value="podcast" name="type"
                       @change="contentStore.filter()" v-model="filters.type">
                <label class="form-check-label" for="checkPodcast">
                    Podcast {{ !isNaN(filterCounts['podcasts']) ? '(' + filterCounts['podcasts'] + ')' : ''}}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="checkVideo" value="video" name="type"
                       @change="contentStore.filter()" v-model="filters.type">
                <label class="form-check-label" for="checkVideo">
                    Video {{ !isNaN(filterCounts['video']) ? '(' + filterCounts['video'] + ')' : ''}}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="checkStream" value="stream" name="type"
                       @change="contentStore.filter()" v-model="filters.type">
                <label class="form-check-label" for="checkStream">
                    Stream {{ !isNaN(filterCounts['stream']) ? '(' + filterCounts['stream'] + ')' : ''}}
                </label>
            </div>
        </div>
        <hr>

        <!-- date -->
        <div class="mb-3">
            <label class="form-label">Datum</label>
            <div class="form-check">
                <input class="form-check-input" type="radio" id="all" value="all"
                       @change="contentStore.filter()" v-model="filters.date.range">
                <label class="form-check-label" for="all">
                    Alle {{ !isNaN(filterCounts['all']) ? '(' + filterCounts['all'] + ')' : ''}}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" id="check3mth" :value="3"
                       @change="contentStore.filter()" v-model="filters.date.range">
                <label class="form-check-label" for="check3mth">
                    < 3 maanden {{ !isNaN(filterCounts['3mth']) ? '(' + filterCounts['3mth'] + ')' : ''}}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" id="check6mth" :value="6"
                       @change="contentStore.filter()" v-model="filters.date.range">
                <label class="form-check-label" for="check6mth">
                    < 6 maanden {{ !isNaN(filterCounts['6mth']) ? '(' + filterCounts['6mth'] + ')' : ''}}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" id="check12mth" :value="12"
                       @change="contentStore.filter()" v-model="filters.date.range">
                <label class="form-check-label" for="check12mth">
                    < 1 jaar {{ !isNaN(filterCounts['12mth']) ? '(' + filterCounts['12mth'] + ')' : ''}}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" id="checkOther" value="other"
                       v-model="filters.date.range">
                <label class="form-check-label" for="checkOther">
                    Anders...
                </label>
            </div>
            <template v-if="filters.date.range === 'other'">
                <label for="afterDate" class="form-label small">Na:</label>
                <input type="date" class="form-control" id="afterDate" @change="contentStore.filter()" v-model="filters.date.after">

                <label for="beforeDate" class="form-label small">Voor:</label>
                <input type="date" class="form-control" id="beforeDate" @change="contentStore.filter()" v-model="filters.date.before">
            </template>
        </div>
        <hr>

        <!-- duration -->
        <div class="mb-3">
            <label class="form-label small">Duur (in minuten)</label>
            <div class="input-group">
                <input type="number" class="form-control" placeholder="min" @change="contentStore.filter()" v-model="filters.duration.min">
                <span class="input-group-text"><i class="bi bi-arrows"></i></span>
                <input type="number" class="form-control" placeholder="max" @change="contentStore.filter()" v-model="filters.duration.max">
            </div>
        </div>
        <hr>

        <button class="btn btn-outline-primary" @click="contentStore.resetFilters">Reset filters</button>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";

const contentStore = useContentStore()
const {filters, search, filterCounts} = storeToRefs(contentStore)
</script>

<style scoped>

</style>
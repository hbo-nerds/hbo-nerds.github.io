<template>
    <h6 class="fw-bold mb-2">Verfijn resultaten</h6>
    <div class="mb-3">
        <!-- type -->
        <div class="mb-3">
            <label class="form-label small">Type</label>
            <div class="form-check" v-for="(count, type, idx) in groupedTypes" :key="idx">
                <input class="form-check-input" type="checkbox" :id="'type-' + type" :value="type" name="type"
                       @change="contentStore.filter()" v-model="filters.type">
                <label class="form-check-label text-capitalize" :for="'type-' + type">
                    {{type}} ({{ count }})
                </label>
            </div>
        </div>
        <hr>

        <!-- date -->
        <div class="mb-3">
            <label class="form-label">Datum</label>
            <div class="form-check" v-for="(count, date, idx) in groupedDates" :key="idx">
                <input class="form-check-input" type="radio" :id="'date-' + date" :value="date"
                       @change="contentStore.filter()" v-model="filters.date.range">
                <label class="form-check-label text-capitalize" :for="'date-' + date">
                    {{ date }} ({{ count }})
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
            <div class="input-group input-group-sm">
                <input type="number" class="form-control" placeholder="min" @change="contentStore.filter()" v-model="filters.duration.min">
                <span class="input-group-text"><i class="bi bi-arrows"></i></span>
                <input type="number" class="form-control" placeholder="max" @change="contentStore.filter()" v-model="filters.duration.max">
            </div>
        </div>
        <hr>

        <!-- activity -->
        <div class="mb-3">
            <label class="form-label small">Activiteit</label>
            <input class="form-control form-control-sm mb-3" placeholder="Filter activiteiten" type="search" v-model="f_term"/>

            <div class="form-check" v-for="(key, idx) in a_activities" :key="idx">
                <input class="form-check-input" type="checkbox" :id="'act-' + idx" :value="key" name="activity"
                       @change="contentStore.filter()" v-model="filters.activity">
                <label class="form-check-label small text-capitalize" :for="'act-' + idx">
                    {{ key }} ({{ groupedActivities[key] }})
                </label>
            </div>
            <hr v-if="a_activities.length">
            <div class="overflow-y-auto" style="max-height: 200px">
                <div class="form-check" v-for="(key, idx) in f_activities" :key="idx">
                    <input class="form-check-input" type="checkbox" :id="'act-' + idx" :value="key" name="activity"
                           @change="contentStore.filter()" v-model="filters.activity">
                    <label class="form-check-label small text-capitalize" :for="'act-' + idx">
                        {{ key }} ({{ groupedActivities[key] }})
                    </label>
                </div>
                <span v-if="!f_activities.length" class="form-check-label small text-capitalize">Geen activiteiten beschikbaar.</span>
            </div>
        </div>
        <hr>

        <button class="btn btn-outline-primary" @click="contentStore.resetFilters">Reset filters</button>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";

const contentStore = useContentStore()
const {filters, search, groupedActivities, groupedTypes, groupedDates} = storeToRefs(contentStore)

const f_term = ref('')
const f_activities = computed(() => {
    return Object.keys(groupedActivities.value).filter(i => i.toLowerCase().includes(f_term.value.toLowerCase())).sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase())
    })
})
const a_activities = computed(() => {
    return Object.keys(groupedActivities.value).filter(i => filters.value.activity.includes(i))
})

</script>

<style scoped>

</style>
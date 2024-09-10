<template>
    <div class="row g-3">
        <!-- date -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">Upload date</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(date, idx) in groupedDates" :key="idx" class="form-check">
                    <input :id="'date-' + idx" v-model="filters.date.range" :value="date.value" class="form-check-input"
                           type="radio" @change="contentStore.filter()" name="date-filter">
                    <label :for="'date-' + idx" class="form-check-label text-capitalize text-nowrap">
                        {{ date.label }} ({{ date.count }})
                    </label>
                </div>
                <!-- other -->
                <div class="form-check">
                    <input id="checkOther" v-model="filters.date.range" class="form-check-input" type="radio"
                           value="other">
                    <label class="form-check-label text-nowrap" for="checkOther">
                        Other...
                    </label>
                </div>
                <div v-if="filters.date.range === 'other'" class="mt-3">
                    <label class="form-label small" for="afterDate">Na:</label>
                    <input id="afterDate" v-model="filters.date.after" class="form-control" type="date"
                           @change="contentStore.filter()">

                    <label class="form-label small" for="beforeDate">Voor:</label>
                    <input id="beforeDate" v-model="filters.date.before" class="form-control" type="date"
                           @change="contentStore.filter()">
                </div>
            </div>
        </div>
        <!-- type -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">Type</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(count, type, idx) in groupedTypes" :key="idx" class="form-check">
                    <input :id="'type-' + type" v-model="filters.type" :value="type" class="form-check-input"
                           name="type"
                           type="checkbox" @change="contentStore.filter()">
                    <label :for="'type-' + type" class="form-check-label text-capitalize text-nowrap">
                        {{ type }} ({{ count }})
                    </label>
                </div>
            </div>
        </div>
        <!-- platform -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">Platform</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(count, platform, idx) in groupedPlatforms" :key="idx" class="form-check">
                    <input :id="'platform-' + platform" v-model="filters.platform" :value="platform"
                           class="form-check-input"
                           name="platform"
                           type="checkbox" @change="contentStore.filter()">
                    <label :for="'platform-' + platform" class="form-check-label text-capitalize text-nowrap">
                        {{ platform }} ({{ count }})
                    </label>
                </div>
            </div>
        </div>
        <!-- duration -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">Duration</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(count, date, idx) in groupedDuration" :key="idx" class="form-check">
                    <input :id="'date-' + date" v-model="filters.duration" :value="date" class="form-check-input"
                           type="radio" @change="contentStore.filter()">
                    <label :for="'date-' + date" class="form-check-label text-capitalize text-nowrap">
                        {{ date }} ({{ count }})
                    </label>
                </div>
            </div>
        </div>
        <!-- general -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">General</h4>
            <div class="d-flex flex-column gap-1">
                <div class="form-check form-switch">
                    <input id="hide_no_vod" v-model="filters.vodOnly" class="form-check-input" name="VOD"
                           role="switch"
                           type="checkbox" @change="contentStore.filter()">
                    <label class="form-check-label small text-nowrap" for="hide_no_vod">Verberg zonder VOD</label>
                </div>
                <div class="form-check form-switch">
                    <input id="hide_paywall" v-model="filters.free" class="form-check-input" name="free"
                           role="switch"
                           type="checkbox" @change="contentStore.filter()">
                    <label class="form-check-label small text-nowrap" for="hide_paywall">Verberg met paywall</label>
                </div>
            </div>
        </div>
        <!-- activity -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">Activity</h4>
            <input id="f_activity" v-model="f_term"
                   class="form-control form-control-sm mb-3" placeholder="Search activity"
                   type="search"/>
            <div v-for="(key, idx) in a_activities" :key="idx" class="form-check">
                <input :id="'act-' + idx" v-model="filters.activity" :value="key" class="form-check-input"
                       name="activity"
                       type="checkbox" @change="contentStore.filter()">
                <label :for="'act-' + idx" class="form-check-label small text-capitalize">
                    {{ key }} ({{ groupedActivities[key] }})
                </label>
            </div>
            <hr v-if="a_activities.length">
            <div class="d-flex flex-column gap-1 overflow-y-auto" style="max-height: 200px">
                <div v-for="(key, idx) in f_activities" :key="idx" class="form-check">
                    <input :id="'act-' + idx" v-model="filters.activity" :value="key"
                           class="form-check-input"
                           name="activity"
                           type="checkbox" @change="contentStore.filter()">
                    <label :for="'act-' + idx" class="form-check-label small text-capitalize">
                        {{ key }} ({{ groupedActivities[key] }})
                    </label>
                </div>
                <span v-if="!f_activities.length" class="form-check-label small text-capitalize">Geen activiteiten beschikbaar.</span>
            </div>
        </div>
        <!-- sort -->
        <div class="col-sm">
            <h4 class="small py-2 fw-lighter border-bottom mb-3">Sort</h4>
            <div class="d-flex flex-column gap-1">
                <div class="form-check">
                    <input id="order-1" v-model="sortOption" class="form-check-input" type="radio"
                           value="newOld">
                    <label class="form-check-label" for="order-1">
                        Upload date (new first)
                    </label>
                </div>
                <div class="form-check">
                    <input id="order-2" v-model="sortOption" class="form-check-input" type="radio"
                           value="oldNew">
                    <label class="form-check-label" for="order-2">
                        Upload date (old first)
                    </label>
                </div>
                <div class="form-check">
                    <input id="order-3" v-model="sortOption" class="form-check-input" type="radio"
                           value="shortLong">
                    <label class="form-check-label" for="order-3">
                        Duration (shortest first)
                    </label>
                </div>
                <div class="form-check">
                    <input id="order-4" v-model="sortOption" class="form-check-input" type="radio"
                           value="longShort">
                    <label class="form-check-label" for="order-4">
                        Duration (longest first)
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";

const contentStore = useContentStore()
const {
    sortOption,
    filters,
    groupedActivities,
    groupedTypes,
    groupedPlatforms,
    groupedDates,
    groupedDuration
} = storeToRefs(contentStore)

const f_term = ref('')
const f_activities = computed(() => {
    return Object.keys(groupedActivities.value).filter(i => normalizeInput(i).includes(normalizeInput(f_term.value))).sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase())
    })
})
const a_activities = computed(() => {
    return Object.keys(groupedActivities.value).filter(i => filters.value.activity.includes(i))
})

function normalizeInput(input) {
    return !input ? '' : input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

</script>

<style lang="css" scoped>
.accordion-button:not(.collapsed) {
    color: unset;
    background-color: unset;
}
</style>
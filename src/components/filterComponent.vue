<template>
    <h6 class="fw-bold mb-2">Verfijn resultaten</h6>
    <div class="mb-3">

        <div class="accordion accordion-flush">
            <!-- type -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button px-0 shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseType" aria-expanded="true" aria-controls="collapseType">
                        <small>Type</small>
                    </button>
                </h2>
                <div id="collapseType" class="accordion-collapse collapse show px-0">
                    <div class="accordion-body px-0">
                        <div class="form-check" v-for="(count, type, idx) in groupedTypes" :key="idx">
                            <input class="form-check-input" type="checkbox" :id="'type-' + type" :value="type" name="type"
                                   @change="contentStore.filter()" v-model="filters.type">
                            <label class="form-check-label text-capitalize" :for="'type-' + type">
                                {{type}} ({{ count }})
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed px-0 shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapsePlatform" aria-expanded="false" aria-controls="collapsePlatform">
                        <small>Platform</small>
                    </button>
                </h2>
                <div id="collapsePlatform" class="accordion-collapse collapse px-0">
                    <div class="accordion-body px-0">
                        <div class="form-check" v-for="(count, platform, idx) in groupedPlatforms" :key="idx">
                            <input class="form-check-input" type="checkbox" :id="'platform-' + platform" :value="platform" name="platform"
                                   @change="contentStore.filter()" v-model="filters.platform">
                            <label class="form-check-label text-capitalize" :for="'platform-' + platform">
                                {{platform}} ({{ count }})
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- date -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed px-0 shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseDate" aria-expanded="false" aria-controls="collapseDate">
                        <small>Datum</small>
                    </button>
                </h2>
                <div id="collapseDate" class="accordion-collapse collapse px-0">
                    <div class="accordion-body px-0">
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
                        <div v-if="filters.date.range === 'other'" class="mt-3">
                            <label for="afterDate" class="form-label small">Na:</label>
                            <input type="date" class="form-control" id="afterDate" @change="contentStore.filter()" v-model="filters.date.after">

                            <label for="beforeDate" class="form-label small">Voor:</label>
                            <input type="date" class="form-control" id="beforeDate" @change="contentStore.filter()" v-model="filters.date.before">
                        </div>
                    </div>
                </div>
            </div>
            <!-- duration -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed px-0 shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseDuration" aria-expanded="false" aria-controls="collapseDuration">
                        <small>Duur</small>
                    </button>
                </h2>
                <div id="collapseDuration" class="accordion-collapse collapse px-0">
                    <div class="accordion-body px-0">
                        <div class="form-label small">In minuten</div>
                        <div class="input-group input-group-sm">
                            <input type="number" class="form-control" placeholder="min" @change="contentStore.filter()" v-model="filters.duration.min">
                            <span class="input-group-text"><i class="bi bi-arrows"></i></span>
                            <input type="number" class="form-control" placeholder="max" @change="contentStore.filter()" v-model="filters.duration.max">
                        </div>
                    </div>
                </div>
            </div>
            <!-- activity -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed px-0 shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        <small>Activiteit</small>
                    </button>
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse px-0">
                    <div class="accordion-body px-0">
                        <input class="form-control form-control-sm mb-3" id="f_activity" placeholder="Filter activiteiten" type="search" v-model="f_term"/>
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
                </div>
            </div>
            <!-- algemeen -->
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button px-0 shadow-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseGeneral" aria-expanded="true" aria-controls="collapseGeneral">
                        <small>Algemeen</small>
                    </button>
                </h2>
                <div id="collapseGeneral" class="accordion-collapse collapse show px-0">
                    <div class="accordion-body px-0">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="VOD" role="switch" id="hide_no_vod"
                                   @change="contentStore.filter()" v-model="filters.vodOnly">
                            <label class="form-check-label small" for="hide_no_vod">Verberg zonder VOD</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="free" role="switch" id="hide_paywall"
                                   @change="contentStore.filter()" v-model="filters.free">
                            <label class="form-check-label small" for="hide_paywall">Verberg met paywall</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn btn-outline-primary" @click="contentStore.resetFilters">Reset filters</button>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";

const contentStore = useContentStore()
const {filters, groupedActivities, groupedTypes, groupedPlatforms, groupedDates} = storeToRefs(contentStore)

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

<style lang="css" scoped>
.accordion-button:not(.collapsed) {
    color: unset;
    background-color: unset;
}
</style>
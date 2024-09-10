<template>
    <button class="btn btn-sm btn-dark" :class="!text ? 'rounded-circle lh-1 p-2' : 'rounded-pill'" data-bs-target="#filterModal"
            data-bs-toggle="modal" type="button">
        <span v-if="text" class="me-2">Filters</span>
        <i class="bi bi-sliders2"></i>
    </button>

    <!-- Modal -->
    <teleport to="body">
        <div id="filterModal" aria-hidden="true" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h1 id="exampleModalLabel" class="modal-title fs-5">Search filters</h1>
                        <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <filter-component></filter-component>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex gap-2
                         w-100">
                            <div class="flex-grow-1">
                                <button class="btn btn-dark border w-100" type="button" @click="content.resetFilters">
                                    Clear filters
                                </button>
                            </div>
                            <div class="flex-grow-1">
                                <button class="btn btn-primary w-100 text-nowrap" data-bs-dismiss="modal" type="button">Show results
                                    ({{ filteredData.length }})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import FilterComponent from "@/components/filterComponent.vue";

defineProps({
    text: {type: Boolean, default: true},
})

const content = useContentStore()
const {filteredData, sortedData, randomData, search} = storeToRefs(content)
</script>

<style scoped>

</style>
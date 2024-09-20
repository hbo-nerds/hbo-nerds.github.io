<template>
    <button class="btn btn-dark btn-circle rounded-circle" data-bs-target="#filterModal"
            data-bs-toggle="modal" title="Open filter" type="button">
        <i class="bi bi-sliders2"></i>
    </button>

    <!-- Modal -->
    <teleport to="body">
        <div id="filterModal" aria-hidden="true" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-lg-down">
                <div class="modal-content bg-body border-0">
                    <div class="modal-header border-0 px-4">
                        <h1 id="exampleModalLabel" class="modal-title fs-5">Search filters</h1>
                        <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                    </div>
                    <div class="modal-body px-4">
                        <filter-component></filter-component>
                    </div>
                    <div class="modal-footer px-4">
                        <div class="d-flex gap-2
                         w-100">
                            <div class="flex-grow-1">
                                <button class="btn btn-dark border w-100" type="button" @click="content.resetFilters">
                                    Clear filters
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
import FilterComponent from "@/components/filterComponent.vue";

const content = useContentStore()
</script>

<style scoped></style>

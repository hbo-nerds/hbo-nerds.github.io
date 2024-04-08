<template>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="bi bi-sliders me-1"></i>Filters
    </button>

    <!-- Modal -->
    <teleport to="body">
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Verfijn resultaten</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">Toon {{ filteredData.length }} resultaten</button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";

const content = useContentStore()
const {filteredData, sortedData, randomData, search} = storeToRefs(content)
</script>

<style scoped>

</style>
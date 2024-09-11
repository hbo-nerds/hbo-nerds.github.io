<template>
    <!-- main -->
    <main>
        <div class="row">
            <div class="col-12 col-sm pt-3">
                <list-component/>
            </div>

            <teleport to="body">
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down modal-lg">
                        <div class="modal-content bg-body">
                            <div class="modal-body">
                                <single-card-component v-if="selectedCard" :card="selectedCard"/>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn-light btn btn-sm rounded-3 ms-auto" data-bs-dismiss="modal">Sluit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </teleport>
        </div>
    </main>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import SingleCardComponent from "@/components/singleCardComponent.vue";
import ListComponent from "@/components/ListComponent.vue";

const contentStore = useContentStore()
const {selectedCard} = storeToRefs(contentStore)

</script>

<style scoped></style>

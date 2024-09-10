<template>
    <!-- main -->
    <main>
        <div class="row">
            <div class="col-12 col-sm position-relative pt-3">
                <list-component/>
            </div>
<!--            <div v-if="selectedCard" class="col-sm-6 col-xl-4">-->
<!--                <div class="sticky-top mb-5">-->
<!--                    <div class="d-flex align-items-center py-3">-->
<!--                        <button class="btn-light fs-7 btn btm-sm rounded-3 text-capitalize text-nowrap ms-auto" type="button"-->
<!--                                @click="selectedCardId = null">Sluit-->
<!--                        </button>-->
<!--                    </div>-->
<!--                    <single-card-component :card="selectedCard"/>-->
<!--                </div>-->
<!--            </div>-->


            <div class="offcanvas offcanvas-end bg-body border-0 px-0" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header">
                    <button class="btn-light btn btn-sm rounded-3 ms-auto" type="button"
                            data-bs-dismiss="offcanvas">Sluit
                    </button>
                </div>
                <div class="offcanvas-body pt-0">
<!--                    <single-card-component v-if="selectedCard" :card="selectedCard"/>-->
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import SingleCardComponent from "@/components/singleCardComponent.vue";
import ListComponent from "@/components/ListComponent.vue";

const contentStore = useContentStore()

const {selectedCardId, selectedCard} = storeToRefs(contentStore)

</script>

<style scoped></style>

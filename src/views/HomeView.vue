<template>
    <div class="container-fluid py-4">
        <div class="row g-3">
            <!-- filter desktop -->
            <div class="col-md-3 col-lg-2 d-none d-lg-block">
                <div class="sticky-top" style="top: 1.5rem">
                    <filter-component></filter-component>
                </div>
            </div>

            <!-- main -->
            <div class="col-12 col-lg-10">
                <div class="row g-2 align-items-center mb-3">
                    <!-- filter mobile -->
                    <div class="col-auto me-auto d-lg-none d-inline-block">
                        <filter-modal>
                            <filter-component></filter-component>
                        </filter-modal>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                                :class="{active: view === 'search'}" @click="generalStore.setView('search')"><i
                            class="bi bi-search me-1"></i>Zoekresultaten
                        </button>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                                :class="{active: view === 'random'}" @click="content.pickRandomSet();generalStore.setView('random')"><i
                            class="bi bi-dice-6 me-1"></i>Random
                        </button>
                    </div>
                    <div class="col-auto ms-auto d-none d-md-block">
                        <span>Sorteer op</span>
                    </div>
                    <div class="col-auto ms-auto ms-md-0">
                        <select class="form-select form-select-sm" v-model="sortOption">
                            <option value="newOld">Datum (nieuw-oud)</option>
                            <option value="oldNew">Datum (oud-nieuw)</option>
                            <option value="shortLong">Duur (kort-lang)</option>
                            <option value="longShort">Duur (lang-kort)</option>
                        </select>
                    </div>
                </div>
                <div class="row g-2">
                    <cards-container></cards-container>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useGeneralStore} from "@/stores/general.js";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import FilterComponent from "@/components/filterComponent.vue";
import CardsContainer from "@/containers/CardsContainer.vue";
import FilterModal from "@/components/filterModal.vue";

// store
const generalStore = useGeneralStore()
const content = useContentStore()
const {view} = storeToRefs(generalStore)
const {sortOption} = storeToRefs(content)
</script>

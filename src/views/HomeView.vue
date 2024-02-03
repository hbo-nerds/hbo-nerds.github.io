<template>
    <div class="container-fluid py-4">
        <div class="row g-3">
            <div class="col-2 d-none d-md-block">
                <filter-component></filter-component>
            </div>
            <div class="col-12 col-md-10">
                <div class="row g-2 align-items-center mb-3">
                    <button type="button" class="col-auto btn btn-outline-primary me-1"
                            :class="{active: view === 'list'}" @click="store.setView('list')"><i
                        class="bi bi-list me-1"></i>Lijst
                    </button>
                    <button type="button" class="col-auto btn btn-outline-primary"
                            :class="{active: view === 'thumbnails'}" @click="store.setView('thumbnails')"><i
                        class="bi bi-card-image me-1"></i>Thumbnails
                    </button>
                    <span class="col-auto ms-auto">{{ filteredData.length }} resultaten</span>
                    <span class="col-auto">|</span>
                    <span class="col-auto">Sorteer op</span>
                    <div class="col-auto">
                        <select class="form-select" v-model="sortOption">
                            <option selected value="">Standaard</option>
                            <option value="newOld">Datum (nieuw-oud)</option>
                            <option value="oldNew">Datum (oud-nieuw)</option>
                            <option value="shortLong">Duur (kort-lang)</option>
                            <option value="longShort">Duur (lang-kort)</option>
                        </select>
                    </div>
                </div>
                <div class="row g-2">
                    <div class="col-12" v-if="!filteredData.length">Dit zijn 12 <b>random</b> items speciaal voor jou! Start met zoeken door een zoekterm in te vullen.
                    </div>
                    <cards-container v-if="view === 'thumbnails'"></cards-container>
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
import CardsContainer from "@/assets/containers/CardsContainer.vue";

// store
const store = useGeneralStore()
const content = useContentStore()
const {view} = storeToRefs(store)
const {filteredData, sortOption} = storeToRefs(content)

</script>

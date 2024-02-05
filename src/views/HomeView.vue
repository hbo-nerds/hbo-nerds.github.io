<template>
    <div class="container-fluid py-4">
        <nav  class="mb-4" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item" aria-current="page" v-if="search.length >= 3">{{ sortedData.length }} resultaten voor '{{search}}'</li>
                <li class="breadcrumb-item" aria-current="page" v-if="search.length < 3">Start met zoeken door een zoekterm in te vullen.</li>
            </ol>
        </nav>
        <div class="row g-3">
            <div class="col-md-3 col-lg-2 d-none d-md-block">
                <filter-component></filter-component>
            </div>
            <div class="col-12 d-md-none">
                <filter-modal>
                    <filter-component></filter-component>
                </filter-modal>
            </div>
            <div class="col-12 col-md-9 col-lg-10">
                <div class="row g-2 align-items-center mb-3">
                    <div class="col-auto">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                                :class="{active: view === 'list'}" @click="store.setView('list')"><i
                            class="bi bi-list me-1"></i>Lijst
                        </button>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-sm btn-outline-primary"
                                :class="{active: view === 'thumbnails'}" @click="store.setView('thumbnails')"><i
                            class="bi bi-card-image me-1"></i>Foto's
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
                    <div class="col-12" v-if="!sortedData.length && search">Lekker Appie! Geen resultaten gevonden.</div>
                    <div class="col-12" v-if="!search">Dit zijn 12 <b>random</b> items speciaal voor jou! <button type="button" class="btn btn-sm btn-link" @click="content.pickRandomSet()">Geef me wat anders.</button> </div>
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
import FilterModal from "@/components/filterModal.vue";

// store
const store = useGeneralStore()
const content = useContentStore()
const {view} = storeToRefs(store)
const {sortedData, sortOption, search} = storeToRefs(content)

</script>

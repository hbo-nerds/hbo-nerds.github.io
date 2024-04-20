<template>
    <!-- main -->
    <main style="padding-top: 64px" class="position-relative">
        <filter-chips></filter-chips>


<!--        <div class="row g-2 align-items-center mb-3">-->
<!--            &lt;!&ndash; filter mobile &ndash;&gt;-->
<!--            <div class="col-auto me-auto d-lg-none d-inline-block">-->
<!--                <filter-modal>-->
<!--                    <filter-component></filter-component>-->
<!--                </filter-modal>-->
<!--            </div>-->
<!--            <div class="col-auto">-->
<!--                <button type="button" class="btn btn-sm btn-outline-primary"-->
<!--                        :class="{active: view === 'search'}" @click="generalStore.setView('search')"><i-->
<!--                    class="bi bi-search me-1"></i>Zoekresultaten-->
<!--                </button>-->
<!--            </div>-->
<!--            <div class="col-auto">-->
<!--                <button type="button" class="btn btn-sm btn-outline-primary"-->
<!--                        :class="{active: view === 'random'}" @click="generalStore.setView('random');contentStore.pickRandomSet()"><i-->
<!--                    class="bi bi-dice-6 me-1"></i>Random-->
<!--                </button>-->
<!--            </div>-->
<!--            <div class="col-auto ms-auto d-none d-md-block">-->
<!--                <span>Sorteer op</span>-->
<!--            </div>-->
<!--            <div class="col-auto ms-auto ms-md-0">-->
<!--                <select class="form-select form-select-sm" v-model="sortOption">-->
<!--                    <option value="newOld">Datum (nieuw-oud)</option>-->
<!--                    <option value="oldNew">Datum (oud-nieuw)</option>-->
<!--                    <option value="shortLong">Duur (kort-lang)</option>-->
<!--                    <option value="longShort">Duur (lang-kort)</option>-->
<!--                </select>-->
<!--            </div>-->
<!--        </div>-->

        <cards-container></cards-container>
    </main>
</template>

<script setup>
import {useGeneralStore} from "@/stores/general.js";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import FilterComponent from "@/components/filterComponent.vue";
import CardsContainer from "@/containers/CardsContainer.vue";
import FilterModal from "@/components/filterModal.vue";
import NavigationSide from "@/components/navigationSide.vue";
import FilterChips from "@/components/filterChips.vue";

// store
const generalStore = useGeneralStore()
const contentStore = useContentStore()
const {view} = storeToRefs(generalStore)

const {sortOption} = storeToRefs(contentStore)

</script>

<style scoped></style>

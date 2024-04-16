<template>
    <div class="position-absolute bg-body top-0 start-0 end-0 py-3">
        <div class="d-flex gap-2">
            <div class="chips flex-grow-1 d-flex flex-nowrap overflow-x-auto hide-scrollbar">
                <button @click="contentStore.resetFilters();" type="button" :class="!filters.type.length ? 'btn-light' : 'btn-dark'"
                        class="fs-7 btn btm-sm rounded-3 text-capitalize text-nowrap me-2">Alle</button>

                <div class="me-2" v-for="(type, idx) in alphaTypes" :key="idx">
                    <input class="d-none position-absolute" type="checkbox" :id="'type-' + type" :value="type" name="type"
                           @change="contentStore.filter()" v-model="filters.type">
                    <label type="button" :class="filters.type.includes(type) ? 'btn-light' : 'btn-dark'"
                           class="fs-7 btn btm-sm rounded-3 text-capitalize" :for="'type-' + type">{{type}}</label>
                </div>

                <button @click="toggleRecent" type="button" :class="filters.date.range === '< 3 maanden' ? 'btn-light' : 'btn-dark'"
                        class="fs-7 btn btm-sm rounded-3 text-capitalize text-nowrap me-2">Recente uploads</button>

            </div>
            <div class="flex-shrink-0">
                <button type="button" class="btn btn-sm btn-dark rounded-pill">Over deze data<i class="ms-2 bi bi-exclamation-circle"></i></button>
            </div>
            <div class="flex-shrink-0">
                <filter-modal>
                    <filter-component></filter-component>
                </filter-modal>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import FilterModal from "@/components/filterModal.vue";
import FilterComponent from "@/components/filterComponent.vue";
import {computed} from "vue";

const contentStore = useContentStore()
const {filters, groupedTypes} = storeToRefs(contentStore)

function toggleRecent() {
    filters.value.date.range = filters.value.date.range !== '< 3 maanden' ? '< 3 maanden' : 'alle'
    contentStore.filter()
}

const alphaTypes = computed(() => {
    return Object.keys(groupedTypes.value).sort().reverse();
})


</script>

<style lang="sass" scoped>
.hide-scrollbar
    scrollbar-color: transparent transparent
    &::-webkit-scrollbar
        display: none !important
        -ms-overflow-style: none !important
        scrollbar-width: none !important

</style>
<template>
  <div v-if="view === 'random'" class="pt-2">
    <div class="mb-3">
      <div class="d-flex gap-2 align-items-baseline mb-3">
        <span class="badge rounded-pill text-bg-warning">Let op!</span>
        <span class="fw-lighter small">De randomizer maakt gebruik van de huidige filters.</span>
      </div>

      <button
        class="btn btn-sm btn-dark rounded-pill lh-1 p-2 w-100"
        type="button"
        @click="contentStore.pickRandomSet()"
      >
        <i class="bi bi-dice-5 me-2"></i>Re-roll the dice!
      </button>
    </div>
    <div
      :class="
        selectedCardId
          ? 'row-cols-1 row-cols-xl-2 row-cols-xxl-3 row-cols-3xl-4 row-cols-4xl-5'
          : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
      "
      class="row g-3 mb-5"
    >
      <div v-for="(card, idx) in randomData" :key="idx" class="col">
        <card-component :card="card" />
      </div>
    </div>
  </div>
  <template v-if="view === 'search'">
    <div
      :class="
        selectedCardId
          ? 'row-cols-1 row-cols-xl-2 row-cols-xxl-3 row-cols-3xl-4 row-cols-4xl-5'
          : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
      "
      class="row g-4 mb-5"
    >
      <div v-for="(card, idx) in paginatedData" :key="idx" class="col">
        <card-component :card="card" />
      </div>
    </div>
    <div class="row align-items-center mb-5">
      <div class="col-12 col-md">
        <pagination
          :current-page="pageNumber + 1"
          :items-per-page="pageSize"
          :total-items="sortedData.length"
          @update:currentPage="
            (num) => {
              pageNumber = num - 1
            }
          "
          :max-visible-pages="3"
        />
      </div>
      <div class="col-auto ms-md-auto">
        <span class="badge rounded-pill text-uppercase fw-bold"
          >{{ sortedData.length }} resultaten</span
        >
      </div>
      <div class="col-auto">
        <select v-model="pageSize" aria-label="Default select example" class="form-select">
          <option :value="12">12 resultaten per pagina</option>
          <option :value="24">24 resultaten per pagina</option>
          <option :value="36">36 resultaten per pagina</option>
          <option :value="60">60 resultaten per pagina</option>
          <option :value="'all'">Toon alles ({{ sortedData.length }})</option>
        </select>
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useContentStore } from '@/stores/content.js'
import { storeToRefs } from 'pinia'
import { useGeneralStore } from '@/stores/general.js'
import Pagination from '@/components/pagination.vue'

const CardComponent = defineAsyncComponent(() => import('@/components/cardComponent.vue'))

// store
const generalStore = useGeneralStore()
const contentStore = useContentStore()
const { view, pageSize, pageNumber } = storeToRefs(generalStore)
const { sortedData, randomData, selectedCardId } = storeToRefs(contentStore)

const paginatedData = computed(() => {
  if (pageSize.value === 'all') return sortedData.value
  const start = pageNumber.value * pageSize.value,
    end = start + pageSize.value
  return sortedData.value.slice(start, end)
})
</script>

<style scoped></style>

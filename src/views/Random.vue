<template>
  <div>
    <div class="d-flex flex-wrap gap-3 align-items-center mb-3">
      <button
        class="btn btn-dark border-0 rounded-pill d-inline-block"
        type="button"
        @click="contentStore.pickRandomSet()"
      >
        <i class="bi bi-dice-5 me-2"></i>Geef mij wat anders
      </button>
      <span class="d-inline-flex align-items-baseline gap-2">
        <span class="badge rounded-pill text-bg-warning">Let op!</span>
        <span class="fw-lighter small">De randomizer maakt gebruik van de huidige filters.</span>
      </span>
    </div>
    <div
      class="row g-4"
      :class="
        selectedCard
          ? 'row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-3xl-4 row-cols-4xl-6'
          : 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6'
      "
    >
      <div v-for="card in randomData" :key="card.id" class="col">
        <Card :card="card" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onActivated } from "vue";

const Card = defineAsyncComponent(() => import("@/components/Card.vue"));

const contentStore = useContentStore();
const { randomData, selectedCard } = storeToRefs(contentStore);

onActivated(() => {
  if (!randomData.value.length) contentStore.pickRandomSet();
  const el = document.getElementById("main-content");
  if (el) el.scrollTo({ top: 0, behavior: "instant" });
});
</script>

<style scoped></style>

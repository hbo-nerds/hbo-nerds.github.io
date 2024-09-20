<template>
  <div class="container-fluid py-4">
    <div class="row gy-3 justify-content-center">
      <div class="col-12 col-md-8 mb-md-0">
        <SingleCard :card="card"></SingleCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleCard from "@/components/SingleCard.vue";
import { useContentStore } from "@/stores/content.js";
import { onBeforeMount, ref } from "vue";

import { onBeforeRouteUpdate, useRoute } from "vue-router";
const route = useRoute();
const card = ref(null);

const contentStore = useContentStore();

onBeforeMount(() => {
  card.value = contentStore.getSingleCard(route.params.id);
});

onBeforeRouteUpdate((to, from) => {
  card.value = contentStore.getSingleCard(to.params.id);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>
